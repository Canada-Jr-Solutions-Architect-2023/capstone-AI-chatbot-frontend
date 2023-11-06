import "./App.css"
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css"
import {
  MainContainer,
  ChatContainer,
  ConversationHeader,
  MessageList,
  TypingIndicator,
  Message,
  MessageInput,
} from "@chatscope/chat-ui-kit-react"
import { useMemo, useState, useCallback, useEffect } from "react"
import Axios from "axios";

type TMessage = {
  role: "ASSISTANT" | "USER"
  message: string
}

const CHAT_ENDPOINT = "https://carehub-aichatbot.ee-cognizantacademy.com/api/chatbot/send-message";

function App() {
  const [messageInputValue, setMessageInputValue] = useState("")
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<TMessage[]>([
    {
      message: "Hi, I am CareHub Assistant! Please feel free to ask me anything.",
      role: "ASSISTANT"
    }
  ]);

  // query to send message
  const sendMessage = useCallback(() => {
    setLoading(true);

    Axios.post(CHAT_ENDPOINT, {
      messages,
    })
      .then((response) => {
        const result = response.data as TMessage;

        setMessages((currentData) => ([...currentData, result]));
        setLoading(false);
      })
      .catch((error) => console.error(error));
  }, [messages, setMessages]);

  const handleMessageSubmission = useCallback(() => {
    // add message to the message list
    setMessages((currentMessages) => [
      ...currentMessages,
      {
        message: messageInputValue,
        role: "USER",
      },
    ]);

    // reset the input value
    setMessageInputValue("");
  }, [messageInputValue, setMessageInputValue]);

  useEffect(() => {
    if (messages[messages.length - 1].role === "USER") {
      sendMessage();
    }
  }, [messages, sendMessage]);

  const renderMessages = useMemo(() => {
    return messages.map((message, index) => {
      return (
        <>
          <Message
            key={index}
            model={{
              message: message.message,
              direction: message.role === "USER" ? "outgoing" : "incoming",
              position: "single",
            }}
          />
        </>
      )
    });
  }, [messages])

  return (
    <main>
      <MainContainer responsive style={{ width: "400px" }}>
        <ChatContainer style={{ minHeight: "100%" }}>
          <ConversationHeader>
            <ConversationHeader.Content
              userName="CareHub Support"
              info="One-stop location for all the information you need"
            />
          </ConversationHeader>
          <MessageList
            typingIndicator={loading ? (<TypingIndicator content="CareHub Support is typing" />) : null}
            style={{ padding: "28px 8px" }}
          >
            {renderMessages}
          </MessageList>
          <MessageInput
            autoFocus
            placeholder="How can I help you today?"
            value={messageInputValue}
            onChange={(val) => setMessageInputValue(val)}
            onSend={handleMessageSubmission}
          />
        </ChatContainer>
      </MainContainer>
    </main>
  )
}

export default App
