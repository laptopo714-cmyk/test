// Firestore Database Services
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
} from "firebase/firestore";
import { db } from "./config";

// خدمات الدورات التدريبية
export const courseService = {
  // إنشاء دورة جديدة
  createCourse: async (courseData) => {
    try {
      const docRef = await addDoc(collection(db, "courses"), {
        ...courseData,
        createdAt: new Date(),
        updatedAt: new Date(),
        studentsCount: 0,
        rating: 0,
        reviewsCount: 0,
        isPublished: false,
      });
      return { success: true, courseId: docRef.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // الحصول على جميع الدورات
  getAllCourses: async (filters = {}) => {
    try {
      let q = collection(db, "courses");

      if (filters.category) {
        q = query(q, where("category", "==", filters.category));
      }

      if (filters.level) {
        q = query(q, where("level", "==", filters.level));
      }

      if (filters.isPublished !== undefined) {
        q = query(q, where("isPublished", "==", filters.isPublished));
      }

      q = query(q, orderBy("createdAt", "desc"));

      if (filters.limit) {
        q = query(q, limit(filters.limit));
      }

      const querySnapshot = await getDocs(q);
      const courses = [];
      querySnapshot.forEach((doc) => {
        courses.push({ id: doc.id, ...doc.data() });
      });

      return { success: true, courses };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // الحصول على دورة واحدة
  getCourse: async (courseId) => {
    try {
      const docRef = doc(db, "courses", courseId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { success: true, course: { id: docSnap.id, ...docSnap.data() } };
      } else {
        return { success: false, error: "الدورة غير موجودة" };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // تحديث دورة
  updateCourse: async (courseId, updateData) => {
    try {
      const docRef = doc(db, "courses", courseId);
      await updateDoc(docRef, {
        ...updateData,
        updatedAt: new Date(),
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // حذف دورة
  deleteCourse: async (courseId) => {
    try {
      await deleteDoc(doc(db, "courses", courseId));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
};

// خدمات الدروس
export const lessonService = {
  // إنشاء درس جديد
  createLesson: async (courseId, lessonData) => {
    try {
      const docRef = await addDoc(collection(db, "lessons"), {
        ...lessonData,
        courseId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return { success: true, lessonId: docRef.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // الحصول على دروس دورة معينة
  getCourseLessons: async (courseId) => {
    try {
      const q = query(
        collection(db, "lessons"),
        where("courseId", "==", courseId),
        orderBy("order", "asc")
      );

      const querySnapshot = await getDocs(q);
      const lessons = [];
      querySnapshot.forEach((doc) => {
        lessons.push({ id: doc.id, ...doc.data() });
      });

      return { success: true, lessons };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
};

// خدمات التسجيل في الدورات
export const enrollmentService = {
  // تسجيل طالب في دورة
  enrollStudent: async (userId, courseId) => {
    try {
      const docRef = await addDoc(collection(db, "enrollments"), {
        userId,
        courseId,
        enrolledAt: new Date(),
        progress: 0,
        completedLessons: [],
        isCompleted: false,
      });

      // تحديث عدد الطلاب في الدورة
      const courseRef = doc(db, "courses", courseId);
      const courseSnap = await getDoc(courseRef);
      if (courseSnap.exists()) {
        const currentCount = courseSnap.data().studentsCount || 0;
        await updateDoc(courseRef, {
          studentsCount: currentCount + 1,
        });
      }

      return { success: true, enrollmentId: docRef.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // الحصول على دورات الطالب
  getUserEnrollments: async (userId) => {
    try {
      const q = query(
        collection(db, "enrollments"),
        where("userId", "==", userId)
      );

      const querySnapshot = await getDocs(q);
      const enrollments = [];
      querySnapshot.forEach((doc) => {
        enrollments.push({ id: doc.id, ...doc.data() });
      });

      return { success: true, enrollments };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
};

// خدمات التقييمات
export const reviewService = {
  // إضافة تقييم
  addReview: async (userId, courseId, reviewData) => {
    try {
      const docRef = await addDoc(collection(db, "reviews"), {
        userId,
        courseId,
        ...reviewData,
        createdAt: new Date(),
      });

      // تحديث تقييم الدورة
      await updateCourseRating(courseId);

      return { success: true, reviewId: docRef.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // الحصول على تقييمات دورة
  getCourseReviews: async (courseId) => {
    try {
      const q = query(
        collection(db, "reviews"),
        where("courseId", "==", courseId),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);
      const reviews = [];
      querySnapshot.forEach((doc) => {
        reviews.push({ id: doc.id, ...doc.data() });
      });

      return { success: true, reviews };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
};

// تحديث تقييم الدورة
const updateCourseRating = async (courseId) => {
  try {
    const q = query(
      collection(db, "reviews"),
      where("courseId", "==", courseId)
    );
    const querySnapshot = await getDocs(q);

    let totalRating = 0;
    let reviewsCount = 0;

    querySnapshot.forEach((doc) => {
      totalRating += doc.data().rating;
      reviewsCount++;
    });

    const averageRating = reviewsCount > 0 ? totalRating / reviewsCount : 0;

    const courseRef = doc(db, "courses", courseId);
    await updateDoc(courseRef, {
      rating: averageRating,
      reviewsCount: reviewsCount,
    });
  } catch (error) {
    console.error("Error updating course rating:", error);
  }
};
