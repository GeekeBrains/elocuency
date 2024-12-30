export default {
  fpsLimit: 60,
  particles: {
    number: {
      value: 100,
      density: {
        enable: false,
        value_area: 800,
      },
    },
    color: {
      value: '#000',
    },
    shape: {
      type: 'circle',
      stroke: {
        width: 0,
        color: '#000000',
      },
      polygon: {
        nb_sides: 5,
      },
      image: {
        src: 'https://cdn.matteobruni.it/images/particles/github.svg',
        width: 100,
        height: 100,
      },
    },
    opacity: {
      value: 0.5,
      random: false,
      anim: {
        enable: false,
        speed: 1,
        opacity_min: 0.1,
        sync: false,
      },
    },
    size: {
      value: 5,
      random: true,
      anim: {
        enable: false,
        speed: 40,
        size_min: 0.1,
        sync: false,
      },
    },
    line_linked: {
      enable: true,
      distance: 150,
      color: '#000',
      opacity: 0.4,
      width: 1,
    },
    move: {
      enable: true,
      speed: 2,
      direction: 'none',
      random: false,
      straight: false,
      out_mode: 'out',
      attract: {
        enable: false,
        rotateX: 600,
        rotateY: 1200,
      },
    },
  },
  interactivity: {
    detect_on: 'canvas',
    events: {
      onhover: {
        enable: false,
        mode: 'repulse',
        parallax: {
          enable: false,
          force: 60,
          smooth: 10,
        },
      },
      onclick: {
        enable: true,
        mode: 'emitter',
      },
      resize: true,
    },
    modes: {
      emitters: {
        life: {
          count: 1,
          delay: 0.5,
          duration: 2,
        },
        particles: {
          shape: {
            type: 'star',
            polygon: {
              sides: 7,
            },
          },
          rotate: {
            value: 0,
            random: true,
            direction: 'clockwise',
            animation: {
              enable: true,
              speed: 15,
              sync: false,
            },
          },
          color: {
            value: '#f0f',
          },
          lineLinked: {
            enable: false,
          },
          opacity: {
            value: 1,
          },
          size: {
            value: 15,
            random: false,
          },
          move: {
            speed: 20,
            random: false,
            outMode: 'destroy',
          },
        },
      },
      grab: {
        distance: 400,
        line_linked: {
          opacity: 1,
        },
      },
      bubble: {
        distance: 400,
        size: 40,
        duration: 2,
        opacity: 0.8,
        speed: 3,
      },
      repulse: {
        distance: 200,
      },
      push: {
        particles_nb: 4,
      },
      remove: {
        particles_nb: 2,
      },
    },
  },
  retina_detect: true,
  background: {
    color: '#fff',
    image: '',
    position: '50% 50%',
    repeat: 'no-repeat',
    size: 'cover',
  },
  emitters: [
    {
      direction: 'top',
      position: {
        x: 50,
        y: 95,
      },
      rate: {
        delay: 0.5,
      },
      size: {
        width: 100,
        height: 10,
      },
      particles: {
        color: {
          value: 'random',
        },
        lineLinked: {
          enable: false,
        },
        opacity: {
          value: 0.5,
        },
        size: {
          value: 300,
          random: {
            enable: true,
          },
        },
        move: {
          speed: 5,
          random: false,
          outMode: 'destroy',
        },
      },
    },
    {
      direction: 'top-right',
      position: {
        x: 0,
        y: 100,
      },
      particles: {
        shape: {
          type: 'star',
        },
        color: {
          value: '#f00',
        },
        lineLinked: {
          id: 'id2',
          enable: true,
          color: 'random',
        },
        opacity: {
          value: 0.3,
        },
        rotate: {
          value: 0,
          random: true,
          direction: 'counter-clockwise',
          animation: {
            enable: true,
            speed: 15,
            sync: false,
          },
        },
        size: {
          value: 10,
          random: {
            enable: true,
          },
        },
        move: {
          angle: 30,
          speed: 10,
          random: false,
          outMode: 'destroy',
        },
      },
    },
    {
      direction: 'top-left',
      position: {
        x: 100,
        y: 100,
      },
      particles: {
        shape: {
          type: 'square',
        },
        rotate: {
          value: 0,
          random: true,
          direction: 'clockwise',
          animation: {
            enable: true,
            speed: 15,
            sync: false,
          },
        },
        color: {
          value: '#00f',
        },
        lineLinked: {
          enable: false,
        },
        opacity: {
          value: 0.8,
        },
        size: {
          value: 15,
          random: false,
        },
        move: {
          speed: 20,
          random: false,
          outMode: 'destroy',
        },
      },
    },
    {
      life: {
        count: 10,
        delay: 0.5,
        duration: 3,
      },
      particles: {
        shape: {
          type: 'polygon',
          polygon: {
            sides: 6,
          },
        },
        rotate: {
          value: 0,
          random: true,
          direction: 'clockwise',
          animation: {
            enable: true,
            speed: 15,
            sync: false,
          },
        },
        color: {
          value: '#0f0',
        },
        lineLinked: {
          enable: false,
        },
        opacity: {
          value: 1,
        },
        size: {
          value: 15,
          random: false,
        },
        move: {
          angle: 45,
          speed: 20,
          random: false,
          outMode: 'destroy',
        },
      },
    },
  ],
};
