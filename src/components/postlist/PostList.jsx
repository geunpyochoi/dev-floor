import React from "react";
import more from "../../assets/images/s-icon-more-vertical.png";
import like from "../../assets/images/icon-heart.png";
import message from "../../assets/images/icon-message-circle.png";
import { useState, useEffect } from "react";
import { postUserApi, postDel } from "../../api/PostApi";
import { useRecoilValue } from "recoil";
import { useInView } from "react-intersection-observer";
import { Sect3 } from "./PostListStyle";
import { profileImgState, tokenState } from "../../state/AuthAtom";
import { accountNameState } from "../../state/AuthAtom";
import ModalPostDel from "../modal/ModalPostDel";
import { useNavigate } from "react-router-dom";

export default function PostList() {
  const accountName = useRecoilValue(accountNameState);
  const [postData, setPostData] = useState([]);
  const [skip, setSkip] = useState(0);
  const [ref, inView] = useInView();
  const image = useRecoilValue(profileImgState);
  const token = useRecoilValue(tokenState);
  const [isPostId, setIsPostId] = useState(null);
  const [ismodalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // 날짜 데이터 변환 함수
  const getDate = (date) => {
    const _date = new Date(date);
    const yyyy = _date.getFullYear();
    const mm = _date.getMonth() + 1;
    const dd = _date.getDate();
    const hours = _date.getHours();
    const minutes = _date.getMinutes();
    return `${yyyy}.${mm}.${dd}. ${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  };

  // 유저 게시글 목록 api 요청
  const postFetch = async () => {
    try {
      console.log("토큰", token);
      console.log("어카운트네임", accountName);
      const result = await postUserApi(accountName, token, skip);

      console.log("@@@");
      console.log(result.post);
      console.log(postData);

      setPostData((postData) => {
        return [...postData, ...result.post];
      });
      setSkip((skip) => skip + 20);
    } catch (error) {
      console.log("실패했습니다");
    }
  };

  // iinView && !isend가 true 일 때만 데이터를 불러옴!
  // 페이지 시작 시 렌더링
  useEffect(() => {
    if (inView) {
      console.log(inView, "무한 스크롤 요청 🎃");
      postFetch();
    }
  }, [inView]);

  //게시글 상세페이지로 이동
  const handlePostClick = () => {
    navigate('/post');
    //상세페이지 생기면 이걸로 navigate(`/post/${postId}`);
  }
  //게시글 삭제
  const handlePostDel = async () => {
    try {
      if(isPostId) {
        await postDel(isPostId, token)
        console.log(isPostId, token)
        setPostData(prev=>
          prev.filter(item=>item.id !== isPostId)
        )
  
        setIsPostId(null)
      }
    } catch (error) {
      console.error("게시글 삭제 실패")
    }
    setIsModalOpen(false)
  }

  const modalOpen = (post_id) => {
    setIsModalOpen(true)
    setIsPostId(post_id)
  }
  return (
    <Sect3>
      <div>
        {postData?.map((item, idx) => {
          return (
            <div className='content-container' key={idx} onClick={()=>handlePostClick(item.id)}>
              <div className='content-list'>
                <img src={image} alt='' className='profile-img' />
                <div className='content'>
                  <div className='content-title'>
                    <div className='content-id'>
                      <h3>{item.author.accountname}</h3>
                      <p>{item.author.username}</p>
                    </div>
                    <div>
                      <button onClick={()=>modalOpen(item.id)}>
                        <img src={more} alt='' />
                      </button>
                    </div>
                  </div>
                  <div className='content-inner'>
                    <p>{item.content}</p>
                    <img src={item.image} alt='' />
                  </div>
                  <div className='like-comment'>
                    <button>
                      <img src={like} alt='' /> <span>58</span>
                    </button>
                    <button>
                      <img src={message} alt='' /> <span>12</span>
                    </button>
                  </div>
                  <span className='date'>{getDate(item.updatedAt)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div ref={ref}>.</div>
      {ismodalOpen && (<ModalPostDel setIsModalOpen={setIsModalOpen} handlePostDel={handlePostDel}/>)}

    </Sect3>
  );
}
