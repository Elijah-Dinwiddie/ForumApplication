import { useState } from "react";


/*Page variable increments by 5, each increment then changes the value to the next set so 0 is 1 2 3 4 5.   and when page is 5. the buttons are 6 7 8 9 10 */
export default function PagBar({offset, setOffset, page, setPage}) {
    
    function updatePage(newPage) {
        setOffset(newPage * 10);
        console.log("Here is page: ", page);
        console.log("Here is offset: ", offset);
    }

    // update the page value, which determines the offset for posts and the display numbers for  pagBar buttons
    function updatePagePag(currentPage, changeValue) {
        if(page==0 && changeValue==-5) {
        return;
        }
        setPage(currentPage+changeValue);
    }

  return (
    <div>
      <button onClick={() => updatePagePag(page, -5)}>Prev</button>
      {[0,1,2,3,4].map(i => (
        <button
          key={i}
          className="pag-button"
          onClick={() => updatePage(page + i)}
        >
          {page + i + 1}
        </button>
      ))}
      <button onClick={() => updatePagePag(page, 5)}>Next</button>
    </div>
  )
}