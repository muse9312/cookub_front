import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from 'react-router-dom';
import noImg from '../assets/img/noimg.PNG';
import style from '../veiw/MyPage.module.css';
import LoadingBar from "./LodingBar";
import Logo from "../assets/img/CookubLogo.png"
import Cookies from 'universal-cookie';


const PrivatePage = ()=>{
  const {key}  = useParams(); //url 의 key 변수에 저장.
 
  const [dataTest, setDataTest] = useState([]);
  const [anySwitch, setAnySwitch] = useState(false)
  const [userName, setUserName] = useState();
  const cookie = new Cookies();
  const token = cookie.get('token');

  const s3URL = "https://s3-bucket-react-file-upload-test-5jo.s3.us-east-2.amazonaws.com/upload/" // --> 리사이징 안된 이미지 저장하는곳


  useEffect(()=>{
    setAnySwitch(true)
    axios
    .get(`http://${process.env.REACT_APP_HOST}/mypage/private/${key}`)
    .then((res) => {
      console.log(res);
      console.log(res.data);
      setDataTest(res.data)
      setUserName(res.data[0].user.username)
      setAnySwitch(false)
    })
    //state에 리턴된 데이터를 냄
  },[])

  const string_cuting = (value) => {
    let string = '';
    if (value == null) {
      string = "만드는 법 미기재";
    } else {
      for (const v of value) {
        string = string + v.description
      }
    }

    return string
  }

  function BtnProfile(e) {
    e.preventDefault();
    window.sessionStorage.setItem("id", userName);
    window.location.href = "/Publicprofile";
  }

    return(
    <>
      {dataTest
        ?(
        <div className={style.private_header}>
          <div className={style.private_logo}>
            <a className="imgbtn" href={'/'}>
              <img src={Logo} alt="COOKUB"/>
            </a>
            {userName
            ?<div className={style.private_header_title} onClick={BtnProfile}><h1 className={style.letsProfile}>{`${userName}님의 레시피 저장소입니다.`}</h1></div>
            :<h1 className={ style.private_header_title}>안녕하세요! 'Cookub'입니다</h1>}
          </div>
          {anySwitch && <LoadingBar/>}
            {/* // 키가 유효할때 레시피를 보여주는 UI */}
          <div className={style.public_recipes}>
              {dataTest.map((data, index) => (
                <>{/* 레시피데이터 반복문 돌리면서 바인딩 */}
                  <div className={style.recipe}>
                    <Link to="/board/detail2" className={style.imageAndText}
                      onClick={() => {
                        window.sessionStorage.setItem(
                          "detail_recipeId", data.recipeId
                        );
                      }}>
                      {data.foodImage
                        ? <img className={style.recipe_img} src={s3URL + data.foodImage} alt="testimg" title="testimg" /> //s3에 있는 이미지
                        : <img className={style.recipe_img} src={noImg} alt="testimg" title="testimg" />} {/*대체이미지(NoImage)*/}

                      <h2 className={style.recipe_title}>{data.title == null ? "제목이 없습니다." : data.title}</h2>
                      <h5 className={style.recipe_title2}>
                        {data.keywordList.map((v) => ("#" + v.keywordName + "  "))}
                      </h5>
                      <ul className={style.recipe_genres}>
                        {"Time " + data.cookingTime.toString() + "Min | level "
                          + data.level + " | " + (data.isOpenable === 1 ? "공개" : "비공개")}
                      </ul>
                      <p className={style.recipe_summary}>
                        {
                          // 문자열 합치는 함수 외부에서 만들어서 사용 -> 글자수넘치면 '...'으로 대체
                          string_cuting(data.cookMethods).length >= 60
                            ? string_cuting(data.cookMethods).substr(0, 60) + " ..."
                            : string_cuting(data.cookMethods)
                        }
                      </p>
                    </Link>
                  </div>
                </>
              ))}
            </div>
          </div>
        
        )
        :( 
          //키가 잘못됐거나 기간이 유효하지 않을때 보여줄 UI
          <div className={style.section}>
            <div className={style.urlFailPage}>
              <div className={style.row}>
                <div className={style.urlFailPageImgSection}>
                  <a className="imgbtn" href={'/'}>
                    <img src={Logo} alt="COOKUB"/>
                  </a>
                </div>
                <h2>&nbsp;&nbsp; 유효하지 않은 키로 접속 하셨습니다!</h2>
                <h2>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  접속 URL을 확인해주세요!</h2>
              </div>
            </div>
          </div>
          )
      }
    </>
  );
}

export default PrivatePage;
