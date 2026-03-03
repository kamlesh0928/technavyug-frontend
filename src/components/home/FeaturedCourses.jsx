function FeaturedCourses() {
  return (
    <section className="courses">
      <h2>Featured Courses</h2>

      <div className="course-grid">
        <div className="course-card">
          <h3>Full Stack Web Development</h3>
          <p>₹499</p>
          <button>Enroll Now</button>
        </div>

        <div className="course-card">
          <h3>UI/UX Design</h3>
          <p>₹399</p>
          <button>Enroll Now</button>
        </div>

        <div className="course-card">
          <h3>Data Science</h3>
          <p>₹699</p>
          <button>Enroll Now</button>
        </div>
      </div>
    </section>
  );
}

export default FeaturedCourses;