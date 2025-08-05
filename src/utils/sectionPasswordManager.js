// Section Password Manager - إدارة كلمات مرور الأقسام والفيديوهات في الجلسة
class SectionPasswordManager {
  constructor() {
    this.unlockedSections = new Set();
    this.unlockedVideos = new Set();
    this.sessionKey = 'unlockedSections';
    this.videoSessionKey = 'unlockedVideos';
    this.loadFromSession();
  }

  // تحميل الأقسام والفيديوهات المفتوحة من الجلسة
  loadFromSession() {
    try {
      // تحميل الأقسام
      const storedSections = sessionStorage.getItem(this.sessionKey);
      if (storedSections) {
        const sections = JSON.parse(storedSections);
        this.unlockedSections = new Set(sections);
      }

      // تحميل الفيديوهات
      const storedVideos = sessionStorage.getItem(this.videoSessionKey);
      if (storedVideos) {
        const videos = JSON.parse(storedVideos);
        this.unlockedVideos = new Set(videos);
      }
    } catch (error) {
      console.error('خطأ في تحميل الأقسام والفيديوهات المفتوحة:', error);
      this.unlockedSections = new Set();
      this.unlockedVideos = new Set();
    }
  }

  // حفظ الأقسام والفيديوهات المفتوحة في الجلسة
  saveToSession() {
    try {
      const sections = Array.from(this.unlockedSections);
      sessionStorage.setItem(this.sessionKey, JSON.stringify(sections));

      const videos = Array.from(this.unlockedVideos);
      sessionStorage.setItem(this.videoSessionKey, JSON.stringify(videos));
    } catch (error) {
      console.error('خطأ في حفظ الأقسام والفيديوهات المفتوحة:', error);
    }
  }

  // فتح قسم (إضافة إلى القائمة)
  unlockSection(sectionId) {
    this.unlockedSections.add(sectionId);
    this.saveToSession();
  }

  // التحقق من أن القسم مفتوح
  isSectionUnlocked(sectionId) {
    return this.unlockedSections.has(sectionId);
  }

  // إغلاق قسم (إزالة من القائمة)
  lockSection(sectionId) {
    this.unlockedSections.delete(sectionId);
    this.saveToSession();
  }

  // إغلاق جميع الأقسام
  lockAllSections() {
    this.unlockedSections.clear();
    sessionStorage.removeItem(this.sessionKey);
  }

  // الحصول على قائمة الأقسام المفتوحة
  getUnlockedSections() {
    return Array.from(this.unlockedSections);
  }

  // === دوال الفيديوهات ===

  // فتح فيديو (إضافة إلى القائمة)
  unlockVideo(videoId) {
    this.unlockedVideos.add(videoId);
    this.saveToSession();
  }

  // التحقق من أن الفيديو مفتوح
  isVideoUnlocked(videoId) {
    return this.unlockedVideos.has(videoId);
  }

  // إغلاق فيديو (إزالة من القائمة)
  lockVideo(videoId) {
    this.unlockedVideos.delete(videoId);
    this.saveToSession();
  }

  // إغلاق جميع الفيديوهات
  lockAllVideos() {
    this.unlockedVideos.clear();
    sessionStorage.removeItem(this.videoSessionKey);
  }

  // الحصول على قائمة الفيديوهات المفتوحة
  getUnlockedVideos() {
    return Array.from(this.unlockedVideos);
  }

  // إغلاق جميع الأقسام والفيديوهات
  lockAll() {
    this.lockAllSections();
    this.lockAllVideos();
  }

  // تنظيف الأقسام والفيديوهات التي لم تعد محمية بكلمة مرور
  cleanupUnprotectedItems(sections, videos) {
    let hasChanges = false;

    // تنظيف الأقسام
    const unlockedSections = Array.from(this.unlockedSections);
    unlockedSections.forEach(sectionId => {
      const section = sections.find(s => s.id === sectionId);
      // إذا لم يعد القسم محمياً بكلمة مرور، أزله من القائمة
      if (section && !section.password) {
        this.unlockedSections.delete(sectionId);
        hasChanges = true;
        console.log(`🔓 تم إزالة القسم ${sectionId} من قائمة الأقسام المحمية`);
      }
    });

    // تنظيف الفيديوهات
    const unlockedVideos = Array.from(this.unlockedVideos);
    unlockedVideos.forEach(videoId => {
      const video = videos.find(v => v.id === videoId);
      // إذا لم يعد الفيديو محمياً بكلمة مرور، أزله من القائمة
      if (video && !video.password) {
        this.unlockedVideos.delete(videoId);
        hasChanges = true;
        console.log(
          `🔓 تم إزالة الفيديو ${videoId} من قائمة الفيديوهات المحمية`
        );
      }
    });

    // حفظ التغييرات إذا كانت هناك تغييرات
    if (hasChanges) {
      this.saveToSession();
      console.log('✅ تم تنظيف قائمة العناصر المحمية');
    }

    return hasChanges;
  }

  // فرض تحديث حالة العنصر (قسم أو فيديو)
  forceRefreshItem(itemId, itemType, hasPassword) {
    let hasChanges = false;

    if (itemType === 'section') {
      if (hasPassword) {
        // إذا كان محمياً، تأكد من أنه مقفل
        if (this.unlockedSections.has(itemId)) {
          this.unlockedSections.delete(itemId);
          hasChanges = true;
        }
      } else {
        // إذا لم يعد محمياً، أزله من القائمة
        if (this.unlockedSections.has(itemId)) {
          this.unlockedSections.delete(itemId);
          hasChanges = true;
        }
      }
    } else if (itemType === 'video') {
      if (hasPassword) {
        // إذا كان محمياً، تأكد من أنه مقفل
        if (this.unlockedVideos.has(itemId)) {
          this.unlockedVideos.delete(itemId);
          hasChanges = true;
        }
      } else {
        // إذا لم يعد محمياً، أزله من القائمة
        if (this.unlockedVideos.has(itemId)) {
          this.unlockedVideos.delete(itemId);
          hasChanges = true;
        }
      }
    }

    if (hasChanges) {
      this.saveToSession();
    }

    return hasChanges;
  }
}

// إنشاء مثيل واحد للاستخدام في التطبيق
const sectionPasswordManager = new SectionPasswordManager();

export default sectionPasswordManager;
