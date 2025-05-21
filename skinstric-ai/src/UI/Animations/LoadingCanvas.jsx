import React, { useEffect } from "react";
import "../Styles/loadingCanvas.css";

const LoadingCanvas = () => {
  useEffect(() => {
    const c = document.getElementById("canv");
    const $ = c.getContext("2d");
    let w = (c.width = window.innerWidth / 1.2);
    let h = (c.height = window.innerHeight / 1.2);
    let cnt = 10;

    const draw = () => {
      let i, b, arr, _arr, rz, x, y, px, py;
      const pts = Math.cos(Math.PI * 2) / (8 / 2);
      $.globalCompositeOperation = "source-over";
      $.fillRect(0, 0, w, h);
      $.globalCompositeOperation = "xor";
      const dims = 0.85 + Math.sin(cnt / 43) / 25;
      const rot = Math.sin(cnt / 73);
      let _w = w;

      for (b = 0; b < 80; b++) {
        rz = cnt / 25 + (b / 5) * rot;
        px = Math.cos(rz / 6) * (b / 40) + 100;
        py = Math.sin(rz / 6) * (b / 40) + 100;
        $.beginPath();
        arr = [];
        for (i = 0; i < 8; i++) {
          x = Math.sin(rz) * _w + c.width / 2;
          y = Math.cos(rz) * _w + c.height / 2;
          rz += (Math.PI * 2) / 4;
          if (i) $.lineTo(x, y);
          else $.moveTo(x, y);
          arr[i] = [x, y];
        }
        $.fillStyle = "hsla(196, 95%, 25%, 1)";
        $.closePath();
        $.fill();
        if (b)
          for (i = 0; i < 8; i++) {
            $.beginPath();
            $.moveTo(arr[i][0], arr[i][1]);
            $.lineTo(_arr[i][0], _arr[i][1]);
            $.fill();
          }
        _arr = [];
        rz += (Math.PI * 2) / (2 / 4);
        for (i = 0; i < 8; i++) {
          x = Math.sin(rz) * _w * pts + 200;
          y = Math.cos(rz) * _w * pts + 200;
          _arr[i] = [x, y];
          rz += (Math.PI * 2) / (2 / 4);
        }
        _w *= dims;
      }
      cnt++;
      window.requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      c.width = w = window.innerWidth / 1.2;
      c.height = h = window.innerHeight / 1.2;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return <canvas id="canv"></canvas>;
};

export default LoadingCanvas;
