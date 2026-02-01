import React, { useEffect } from 'react';

const HeartCanvas = () => {
  useEffect(() => {
    const init = () => {
      const mobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
        (navigator.userAgent || navigator.vendor || window.opera).toLowerCase()
      );
      const koef = mobile ? 0.5 : 1;
      const canvas = document.getElementById('heart');
      const ctx = canvas.getContext('2d');
      let width = (canvas.width = koef * window.innerWidth);
      let height = (canvas.height = koef * window.innerHeight);

      ctx.fillStyle = 'rgba(0,0,0,1)';
      ctx.fillRect(0, 0, width, height);
      ctx.font = '30px Arial';
      ctx.fillText('Tuan', 10, 50);

      const heartPosition = (rad) => [
        Math.pow(Math.sin(rad), 3),
        -(15 * Math.cos(rad) - 5 * Math.cos(2 * rad) - 2 * Math.cos(3 * rad) - Math.cos(4 * rad)),
      ];

      const scaleAndTranslate = (pos, sx, sy, dx, dy) => [dx + pos[0] * sx, dy + pos[1] * sy];

      const resizeCanvas = () => {
        width = canvas.width = koef * window.innerWidth;
        height = canvas.height = koef * window.innerHeight;
        ctx.fillStyle = 'rgba(0,0,0,1)';
        ctx.fillRect(0, 0, width, height);
      };

      window.addEventListener('resize', resizeCanvas);

      const pointsOrigin = [];
      const traceCount = mobile ? 20 : 50;
      const rand = Math.random;
      const dr = mobile ? 0.3 : 0.1;
      const targetPoints = [];

      for (let i = 0; i < Math.PI * 2; i += dr) {
        pointsOrigin.push(scaleAndTranslate(heartPosition(i), 210, 13, 0, 0));
        pointsOrigin.push(scaleAndTranslate(heartPosition(i), 150, 9, 0, 0));
        pointsOrigin.push(scaleAndTranslate(heartPosition(i), 90, 5, 0, 0));
      }

      const heartPointsCount = pointsOrigin.length;

      const pulse = (kx, ky) => {
        pointsOrigin.forEach((point, i) => {
          targetPoints[i] = [
            kx * point[0] + width / 2,
            ky * point[1] + height / 2,
          ];
        });
      };

      const e = Array.from({ length: heartPointsCount }, () => {
        const x = rand() * width;
        const y = rand() * height;
        const trace = Array.from({ length: traceCount }, () => ({ x, y }));

        return {
          vx: 0,
          vy: 0,
          R: 2,
          speed: rand() + 5,
          q: ~~(rand() * heartPointsCount),
          D: 2 * (~~(rand() * 2)) - 1,
          force: 0.2 * rand() + 0.7,
          f: 'rgba(51, 204, 255, 0.7)',
          trace,
        };
      });

      const config = { traceK: 0.4, timeDelta: 0.6 };
      let time = 0;

      const loop = () => {
        const n = -Math.cos(time);
        pulse((1 + n) * 0.5, (1 + n) * 0.5);
        time += ((Math.sin(time) < 0 ? 9 : n > 0.8 ? 0.2 : 1) * config.timeDelta);
        ctx.fillStyle = 'rgba(0,0,0,.1)';
        ctx.fillRect(0, 0, width, height);

        e.forEach((particle) => {
          const q = targetPoints[particle.q];
          const dx = particle.trace[0].x - q[0];
          const dy = particle.trace[0].y - q[1];
          const length = Math.sqrt(dx * dx + dy * dy);

          if (length < 10) {
            if (rand() > 0.95) {
              particle.q = ~~(rand() * heartPointsCount);
            } else if (rand() > 0.99) {
              particle.D *= -1;
            }

            particle.q = (particle.q + particle.D) % heartPointsCount;
            if (particle.q < 0) particle.q += heartPointsCount;
          }

          particle.vx += (-dx / length) * particle.speed;
          particle.vy += (-dy / length) * particle.speed;
          particle.trace[0].x += particle.vx;
          particle.trace[0].y += particle.vy;
          particle.vx *= particle.force;
          particle.vy *= particle.force;

          particle.trace.reduce((prev, curr) => {
            curr.x -= config.traceK * (curr.x - prev.x);
            curr.y -= config.traceK * (curr.y - prev.y);
            return curr;
          });

          ctx.fillStyle = particle.f;
          particle.trace.forEach((t) => ctx.fillRect(t.x, t.y, 1, 1));
        });

        window.requestAnimationFrame(loop);
      };

      loop();
    };

    init();
  }, []);

  return (
    <canvas
      id="heart"
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
      }}
    ></canvas>
  );
};

export default HeartCanvas;
