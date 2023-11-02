import React, { useEffect } from "react";
import profileImg from "../../assets/images/Group 26.png";
import back from "../../assets/images/icon-arrow-left.png";
import upload from "../../assets/images/upload-file.png";
import { Body, Sect1, Sect2 } from "./PostWriteStyle";
import { useRecoilState, useRecoilValue } from "recoil";
import { useRef } from "react";
import { useState } from "react";
import { contentState, imageState, postIdState } from "../../state/PostAtom";
import { useNavigate } from "react-router-dom";
import { postPostApi, imageApi } from "../../api/PostApi";
import { profileImgState, tokenState } from "../../state/AuthAtom";

export default function PostWrite() {
  const [content, setContent] = useRecoilState(contentState);
  const [image, setImage] = useRecoilState(imageState);
  const [postId, setPostId] = useRecoilState(postIdState);
  const [apiImage, setApiImage] = useState("");
  const proImg = useRecoilValue(profileImgState);

  const fileRef = useRef(null);
  const navigate = useNavigate();
  const token = useRecoilValue(tokenState);

  console.log(image);

  const onChangeContent = (e) => {
    setContent(e.target.value);
  };

  const onClickImage = (e) => {
    fileRef.current?.click(e.target.files?.[0]);
  };

  const onChangeFile = async (e) => {
    // 이미지 미리보기
    const file = fileRef.current.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImage(reader.result);
    };
    // 이미지 api 요청
    try {
      const result = await imageApi(file);
      setApiImage("https://api.mandarin.weniv.co.kr/" + result.filename);
    } catch (error) {
      console.log(error);
    }
  };

  const onClickUpLoad = async (e) => {
    e.preventDefault();
    // 게시글 등록 api 요청
    try {
      const result = await postPostApi(content, apiImage, token);
      setPostId(result.post.author.accountname);
      navigate("/myprofile");
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect(() => {
  //   console.log("post.id: " + postId);
  // }, [postId]);

  return (
    <Body>
      <Sect1>
        <button>
          <img src={back} alt='' />
        </button>
        <button className='upload' onClick={onClickUpLoad}>
          업로드
        </button>
      </Sect1>
      <Sect2>
        <div className='write-main'>
          <img src={proImg} alt='' className='profile-img' />
          <div className='writeBox'>
            <input
              placeholder='게시글 입력하기...'
              onChange={onChangeContent}
            />
            <input
              style={{ display: "none" }}
              type='file'
              onChange={onChangeFile}
              ref={fileRef}
            />
            <div>{image && <img src={apiImage}></img>}</div>
          </div>
        </div>
        <div className='write-bottom'>
          <button className='send' onClick={onClickImage}>
            <img src={upload} alt='' className='profile-img' />
          </button>
        </div>
      </Sect2>
    </Body>
  );
}
