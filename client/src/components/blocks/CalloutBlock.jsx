import React from "react";
import ReactMarkdown from "react-markdown";
import {Info, AlertTriangle, Lightbulb, CheckCircle, XCircle} from "lucide-react";
import "./CalloutBlock.css";

const CalloutBlock = ({content, calloutType}) => {
  const iconMap = {
    info: <Info size={24} color="var(--secondary)" />,
    warning: <AlertTriangle size={24} color="var(--accent)" />,
    tip: <Lightbulb size={24} color="#9333EA" />,
    success: <CheckCircle size={24} color="var(--primary)" />,
    danger: <XCircle size={24} color="var(--danger)" />,
  };

  return (
    <div className={`callout-block ${calloutType}`}>
      <div className="callout-icon">
        {iconMap[calloutType] || <Info size={24} />}
      </div>
      <div style={{ flexGrow: 1 }}>
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
};

export default CalloutBlock;
