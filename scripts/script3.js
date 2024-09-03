const translations = {
    pt: {
      homeTitle: "Sup, É o <span>Numb</span>",
      homeSubtitle: "Sou um <span></span><label for=''>|</label>",
      homeDescription: "Meu nome é Fernando, tenho 22 anos e estou estudando Desenvolvimento Full Stack Java no SENAC. Apaixonado por tecnologia, estou sempre buscando aprender mais e criar projetos incríveis.",
      servicesHeading: "Serviços",
      serviceWeb: "Desenvolvimento Web",
      serviceWebDescription: "Criando websites responsivos e dinâmicos usando tecnologias modernas.",
      serviceVideo: "Edição de Vídeo",
      serviceVideoDescription: "Edição profissional de vídeo para vários formatos de mídia.",
      serviceDesign: "Design UI/UX",
      serviceDesignDescription: "Desenhando interfaces intuitivas e visualmente atraentes.",
      skillsHeading: "Habilidades",
      skillHtml: "HTML",
      skillCss: "CSS",
      skillJs: "JavaScript",
      skillGit: "Git",
      educationHeading: "Minha <span>Educação</span>",
      eduFaculty: "Faculdade",
      eduFacultyDesc: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Numquam maiores tempora corporis quae, nisi illum veniam laboriosam eum recusandae illo.",
      eduHighschool: "Ensino Médio",
      eduHighschoolDesc: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Numquam maiores tempora corporis quae, nisi illum veniam laboriosam eum recusandae illo.",
      eduCourse: "Curso Especializado",
      eduCourseDesc: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Numquam maiores tempora corporis quae, nisi illum veniam laboriosam eum recusandae illo.",
      projectsHeading: "Projetos",
      project1Title: "Projeto 1",
      project1Desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      project2Title: "Projeto 2",
      project2Desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      project3Title: "Projeto 3",
      project3Desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      contactNameLabel: "Nome:",
      contactEmailLabel: "Email:",
      contactMessageLabel: "Mensagem:",
      contactSubmit: "Enviar"
    },
    en: {
      homeTitle: "Sup, It's <span>Numb</span>",
      homeSubtitle: "I'm a <span></span><label for=''>|</label>",
      homeDescription: "My name is Fernando, I'm 22 years old, and I'm studying Full Stack Java development at SENAC. Passionate about technology, I'm always seeking to learn more and create amazing projects.",
      servicesHeading: "Services",
      serviceWeb: "Web Development",
      serviceWebDescription: "Creating responsive and dynamic websites using modern technologies.",
      serviceVideo: "Video Editing",
      serviceVideoDescription: "Professional video editing for various media formats.",
      serviceDesign: "UI/UX Design",
      serviceDesignDescription: "Designing intuitive and visually appealing user interfaces.",
      skillsHeading: "Skills",
      skillHtml: "HTML",
      skillCss: "CSS",
      skillJs: "JavaScript",
      skillGit: "Git",
      educationHeading: "My <span>Education</span>",
      eduFaculty: "Faculty",
      eduFacultyDesc: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Numquam maiores tempora corporis quae, nisi illum veniam laboriosam eum recusandae illo.",
      eduHighschool: "High School",
      eduHighschoolDesc: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Numquam maiores tempora corporis quae, nisi illum veniam laboriosam eum recusandae illo.",
      eduCourse: "Specialized Course",
      eduCourseDesc: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Numquam maiores tempora corporis quae, nisi illum veniam laboriosam eum recusandae illo.",
      projectsHeading: "Projects",
      project1Title: "Project 1",
      project1Desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      project2Title: "Project 2",
      project2Desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      project3Title: "Project 3",
      project3Desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      contactNameLabel: "Name:",
      contactEmailLabel: "Email:",
      contactMessageLabel: "Message:",
      contactSubmit: "Send"
    }
  };
  
  // Function to switch languages
  function switchLanguage(language) {
    const elements = {
      homeTitle: document.getElementById('home-title'),
      homeSubtitle: document.getElementById('home-subtitle'),
      homeDescription: document.getElementById('home-description'),
      servicesHeading: document.getElementById('services-heading'),
      serviceWeb: document.getElementById('service-web'),
      serviceWebDescription: document.getElementById('service-web-description'),
      serviceVideo: document.getElementById('service-video'),
      serviceVideoDescription: document.getElementById('service-video-description'),
      serviceDesign: document.getElementById('service-design'),
      serviceDesignDescription: document.getElementById('service-design-description'),
      skillsHeading: document.getElementById('skills-heading'),
      skillHtml: document.getElementById('skill-html'),
      skillCss: document.getElementById('skill-css'),
      skillJs: document.getElementById('skill-js'),
      skillGit: document.getElementById('skill-git'),
      educationHeading: document.getElementById('education-heading'),
      eduFaculty: document.getElementById('edu-faculty'),
      eduFacultyDesc: document.getElementById('edu-faculty-desc'),
      eduHighschool: document.getElementById('edu-highschool'),
      eduHighschoolDesc: document.getElementById('edu-highschool-desc'),
      eduCourse: document.getElementById('edu-course'),
      eduCourseDesc: document.getElementById('edu-course-desc'),
      projectsHeading: document.getElementById('projects-heading'),
      project1Title: document.getElementById('project-1-title'),
      project1Desc: document.getElementById('project-1-desc'),
      project2Title: document.getElementById('project-2-title'),
      project2Desc: document.getElementById('project-2-desc'),
      project3Title: document.getElementById('project-3-title'),
      project3Desc: document.getElementById('project-3-desc'),
      contactNameLabel: document.getElementById('contact-name-label'),
      contactEmailLabel: document.getElementById('contact-email-label'),
      contactMessageLabel: document.getElementById('contact-message-label'),
      contactSubmit: document.getElementById('contact-submit')
    };
  
    const translation = translations[language];
  
    for (const key in elements) {
      if (elements[key] && translation[key]) {
        elements[key].innerHTML = translation[key];
      }
    }
  }
  
  // Default language
  switchLanguage('pt');
  