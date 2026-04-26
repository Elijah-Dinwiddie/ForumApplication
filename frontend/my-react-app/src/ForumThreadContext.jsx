import { createContext, useContext, useEffect, useState } from "react";

const ForumThreadInfoContext = createContext(null);

export function ForumThreadInfo({children}) {
    const [forum_id, setForum] = useState(0);
    const [thread_id, setThread] = useState(0);

    return (
    <ForumThreadInfoContext.Provider value={{forum_id, setForum, thread_id, setThread}}>
      {children}
    </ForumThreadInfoContext.Provider>
  );
}

export function useForumThreadInfo() {
  return useContext(ForumThreadInfoContext);
}