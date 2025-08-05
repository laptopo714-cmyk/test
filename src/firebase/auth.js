// Firebase Authentication Services
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./config";

// تسجيل مستخدم جديد
export const registerUser = async (email, password, userData) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // تحديث الملف الشخصي
    await updateProfile(user, {
      displayName: userData.fullName,
    });

    // حفظ بيانات المستخدم في Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      fullName: userData.fullName,
      role: userData.role || "student", // student, instructor, admin
      createdAt: new Date(),
      isActive: true,
      profile: {
        bio: "",
        avatar: "",
        phone: userData.phone || "",
        dateOfBirth: userData.dateOfBirth || null,
        country: userData.country || "",
        interests: [],
      },
    });

    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// تسجيل الدخول
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// تسجيل الخروج
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// تسجيل الدخول بـ Google
export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // التحقق من وجود المستخدم في قاعدة البيانات
    const userDoc = await getDoc(doc(db, "users", user.uid));

    if (!userDoc.exists()) {
      // إنشاء ملف للمستخدم الجديد
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        fullName: user.displayName,
        role: "student",
        createdAt: new Date(),
        isActive: true,
        profile: {
          bio: "",
          avatar: user.photoURL || "",
          phone: "",
          dateOfBirth: null,
          country: "",
          interests: [],
        },
      });
    }

    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// إعادة تعيين كلمة المرور
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// الحصول على بيانات المستخدم من Firestore
export const getUserData = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      return { success: true, userData: userDoc.data() };
    } else {
      return { success: false, error: "المستخدم غير موجود" };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};
