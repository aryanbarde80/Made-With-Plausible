import { InsightChat } from "../../../../../components/ai/insight-chat";
import { aiMessages } from "../../../../../lib/mock-data";

export default function AIPage() {
  return <InsightChat messages={aiMessages} />;
}

