// "use client";
// import { useRef } from "react";
// import React from "react";

// const Page = () => {
//   const canvasRef = useRef<HTMLCanvasElement>(null);

//   const generateSeal = () => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext("2d");
//     if (!ctx) return;

//     const width = 300;
//     const height = 300;
//     const centerX = width / 2;
//     const centerY = height / 2;
//     const radius = 120;

//     // 캔버스 초기화
//     ctx.clearRect(0, 0, width, height);
//     ctx.fillStyle = "white";
//     ctx.fillRect(0, 0, width, height);

//     // 원형 도장 테두리
//     ctx.strokeStyle = "red";
//     ctx.lineWidth = 8;
//     ctx.beginPath();
//     ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
//     ctx.stroke();

//     // 회사명 (외곽 상단)
//     ctx.fillStyle = "red";
//     ctx.font = "bold 22px Arial";
//     ctx.textAlign = "center";
//     ctx.fillText("주식회사 ○○", centerX, centerY - 80);

//     // 중앙 직인 문구
//     ctx.font = "bold 28px Arial";
//     ctx.fillText("법인인", centerX, centerY + 10);
//   };

//   return (
//     <section className="flex flex-col items-center">
//       <canvas ref={canvasRef} width={300} height={300} className="border" />
//       <button
//         onClick={generateSeal}
//         className="mt-4 p-2 bg-red-500 text-white rounded"
//       >
//         법인도장 생성
//       </button>
//     </section>
//   );

//   // return <div></div>;
// };

// export default Page;

"use client";
import { useRef } from "react";
import { fontTest } from "../layout";

const CorporateSeal = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  const generateSeal = () => {
    if (!svgRef.current) return;

    const svgNS = "http://www.w3.org/2000/svg";
    const width = 300;
    const height = 300;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = 120;

    // 기존 SVG 초기화
    svgRef.current.innerHTML = "";

    // SVG 요소 설정
    const svg = svgRef.current;
    svg.setAttribute("width", `${width}`);
    svg.setAttribute("height", `${height}`);
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.setAttribute("xmlns", svgNS);

    // 원형 테두리
    const circle = document.createElementNS(svgNS, "circle");
    circle.setAttribute("cx", `${centerX}`);
    circle.setAttribute("cy", `${centerY}`);
    circle.setAttribute("r", `${radius}`);
    circle.setAttribute("stroke", "red");
    circle.setAttribute("stroke-width", "4");
    circle.setAttribute("fill", "none");
    svg.appendChild(circle);

    // 원형 경로 (텍스트 배치를 위해)
    const path = document.createElementNS(svgNS, "path");
    path.setAttribute(
      "d",
      `M ${centerX - radius}, ${centerY} A ${radius} ${radius} 0 1 1 ${
        centerX + radius
      }, ${centerY}`
    );
    path.setAttribute("fill", "none");
    path.setAttribute("id", "textPath");
    svg.appendChild(path);

    console.log(path);

    // 원형 텍스트 (회사명)
    const text = document.createElementNS(svgNS, "text");
    text.setAttribute("fill", "red");
    text.setAttribute("font-size", "20");
    text.setAttribute("font-weight", "bold");

    const textPath = document.createElementNS(svgNS, "textPath");
    textPath.setAttribute("href", "#textPath");
    textPath.setAttribute("startOffset", "50%");
    textPath.setAttribute("text-anchor", "middle");
    textPath.textContent = "주식회사 비즈비"; // 여기에 원하는 회사명 넣기

    text.appendChild(textPath);
    svg.appendChild(text);

    // 중앙 텍스트 (법인인)
    const centerText = document.createElementNS(svgNS, "text");
    centerText.setAttribute("x", `${centerX}`);
    centerText.setAttribute("y", `${centerY + 10}`);
    centerText.setAttribute("fill", "red");
    centerText.setAttribute("font-size", "40");
    // centerText.setAttribute("word-break", "break-word");
    centerText.setAttribute("font-weight", "bold");
    centerText.setAttribute("text-anchor", "middle");
    centerText.setAttribute("font-family", fontTest.variable);
    centerText.innerHTML = "대표 <br/> 이사";
    // centerText.textContent = "이사";
    svg.appendChild(centerText);
  };

  const downloadSeal = () => {
    if (!svgRef.current) return;

    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svgRef.current);
    const blob = new Blob([source], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "법인도장.svg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <section>
      <svg ref={svgRef} width={300} height={300} className="border" />
      <button onClick={generateSeal}>법인도장 생성</button>
      <button onClick={downloadSeal}>SVG 다운로드</button>
    </section>
  );
};

const Page = () => {
  return (
    <div>
      <CorporateSeal />
    </div>
  );
};

export default Page;
