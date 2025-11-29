import React, {useRef} from "react";
import {X, Printer, FileText, Download} from "lucide-react";
import "./CheatSheetModal.css";

const CheatSheetModal = ({course, onClose}) => {
  const contentRef = useRef(null);

  const handlePrint = () => {
    const printContent = contentRef.current.innerHTML;
    const originalContent = document.body.innerHTML;

    // Create a print-friendly window
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<html><head><title>Cheat Sheet - ' + course.title + '</title>');
    printWindow.document.write('<style>');
    printWindow.document.write(`
      body { font-family: 'Inter', sans-serif; padding: 40px; color: #1a202c; }
      h1 { font-size: 24px; border-bottom: 2px solid #3182ce; padding-bottom: 10px; margin-bottom: 20px; }
      h2 { font-size: 18px; margin-top: 20px; color: #2d3748; background: #edf2f7; padding: 8px; border-radius: 4px; }
      ul { padding-left: 20px; }
      li { margin-bottom: 8px; line-height: 1.5; }
      .section { margin-bottom: 30px; break-inside: avoid; }
      .code-snippet { background: #2d3748; color: #fff; padding: 10px; border-radius: 4px; font-family: monospace; margin: 10px 0; }
      .key-term { font-weight: bold; color: #3182ce; }
    `);
    printWindow.document.write('</style></head><body>');
    printWindow.document.write(printContent);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  // Helper to extract real content from lessons
  const generateCheatSheetData = () => {
    const keyConcepts = [];
    const codeSnippets = [];
    const importantLists = [];

    course.modules.forEach(module => {
      module.lessons.forEach(lesson => {
        if (!lesson.content) return;

        lesson.content.forEach(block => {
          // 1. Extract Callouts as "Key Concepts"
          if (block.type === "callout") {
            keyConcepts.push({
              title: lesson.title,
              text: block.content,
              type: block.variant || "info"
            });
          }
          
          // 2. Extract Code Blocks
          if (block.type === "code") {
            codeSnippets.push({
              title: lesson.title,
              language: block.language,
              code: block.code
            });
          }

          // 3. Extract Lists (often used for steps or features)
          if (block.type === "list" && block.items && block.items.length > 0) {
             // Only take the first few items to keep it concise
             importantLists.push({
               title: lesson.title,
               items: block.items.slice(0, 5)
             });
          }
        });
      });
    });

    return {keyConcepts, codeSnippets, importantLists};
  };

  const {keyConcepts, codeSnippets, importantLists} = generateCheatSheetData();

  return (
    <div className="cheat-sheet-overlay">
      <div className="cheat-sheet-modal">
        <div className="cheat-sheet-header">
          <div className="header-title">
            <FileText size={24} color="var(--primary)" />
            <h3>{course.title} - Cheat Sheet</h3>
          </div>
          <div className="header-actions">
            <button onClick={handlePrint} className="print-btn">
              <Printer size={18} /> Print / PDF
            </button>
            <button onClick={onClose} className="close-btn">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="cheat-sheet-content" ref={contentRef}>
          <h1>{course.title} Cheat Sheet</h1>
          <p className="cheat-sheet-intro">A condensed summary of the most important concepts, code, and steps from this course.</p>

          {/* 1. Key Concepts Section */}
          {keyConcepts.length > 0 && (
            <div className="section">
              <h2>🧠 Core Concepts & Takeaways</h2>
              <div className="concepts-grid">
                {keyConcepts.map((item, i) => (
                  <div key={i} className={`concept-card ${item.type}`}>
                    <strong>{item.title}</strong>
                    <p>{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. Code Snippets Section */}
          {codeSnippets.length > 0 && (
            <div className="section">
              <h2>💻 Essential Code & Syntax</h2>
              {codeSnippets.map((item, i) => (
                <div key={i} className="snippet-wrapper">
                  <div className="snippet-label">{item.title} ({item.language})</div>
                  <pre className="code-snippet">{item.code}</pre>
                </div>
              ))}
            </div>
          )}

          {/* 3. Important Lists Section */}
          {importantLists.length > 0 && (
            <div className="section">
              <h2>⚡ Quick Reference Lists</h2>
              <div className="lists-grid">
                {importantLists.map((list, i) => (
                  <div key={i} className="list-card">
                    <strong>{list.title}</strong>
                    <ul>
                      {list.items.map((item, j) => (
                        <li key={j}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Fallback if no content found */}
          {keyConcepts.length === 0 && codeSnippets.length === 0 && (
             <div className="empty-state">
               <p>No detailed content available to summarize yet. Complete more lessons to populate this cheat sheet!</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheatSheetModal;
