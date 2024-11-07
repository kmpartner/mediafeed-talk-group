import React from "react";
import { useState, useEffect, Fragment } from "react";
import { useTranslation } from "react-i18next/hooks";
import Img from "react-cool-img";
// import jwt from "jsonwebtoken";

import Backdrop from "../Backdrop/Backdrop";
import SmallModal from "../Modal/SmallModal";
import { useStore } from "../../hook-store/store";

import { DRAWDREAMER_URL, KURAIMAGEPHOTO_URL } from "../../App";

import "./DrawDreamerInfo.css";

import TopImage1 from "../../images/for-draw-dreamer/top-images/info-top1-h150.jpg";
import TopImage2 from "../../images/for-draw-dreamer/top-images/info-top2-h150.jpeg";
import TopImage3 from "../../images/for-draw-dreamer/top-images/info-top3-h150.jpeg";
import TopImage4 from "../../images/for-draw-dreamer/top-images/info-top4-h150.jpeg";
import TopImage5 from "../../images/for-draw-dreamer/top-images/info-top5-h150.jpeg";

import DrawImage1 from "../../images/for-draw-dreamer/draw-images/astronaut-in-woods-sketch-h150.jpeg";
import DrawResultImage1 from "../../images/for-draw-dreamer/draw-images/astronaut-in-woods-output-h150.jpeg";
import DrawImage2 from "../../images/for-draw-dreamer/draw-images/panda-jungle-sketch-h150.jpeg";
import DrawResultImage2 from "../../images/for-draw-dreamer/draw-images/panda-jungle-output-h150.jpeg";

import StyleImage1 from "../../images/for-draw-dreamer/for-style-images/a-bed-photographic-h200.jpeg";
import StyleImage2 from "../../images/for-draw-dreamer/for-style-images/a-bed-fantasy-art-h200.jpeg";

import ImageToImage1 from "../../images/for-draw-dreamer/image-to-iamges/woman-turban-input-h200.png";
import ImageToImage1Result1 from "../../images/for-draw-dreamer/image-to-iamges/woman-turban-output-h200.jpeg";
import ImageToImage1Result2 from "../../images/for-draw-dreamer/image-to-iamges/woman-turban-man-output-h200.jpeg";
import ImageToImage1Result3 from "../../images/for-draw-dreamer/image-to-iamges/woman-turban-i2i-ipa-result-h200.jpeg";
import ImageToImage2 from "../../images/for-draw-dreamer/image-to-iamges/canyon-man-input-h200.png";
import ImageToImage2Result from "../../images/for-draw-dreamer/image-to-iamges/canyon-man-output-1-h200.jpeg";
import ImageToImage3 from "../../images/for-draw-dreamer/image-to-iamges/pose-man-h150.png";
import ImageToImage3Result from "../../images/for-draw-dreamer/image-to-iamges/pose-man-output-h150.jpg";

const DrawDreamerInfo = (props) => {
  const { onClose } = props;

  const [t] = useTranslation("translation");

  const [store, dispatch] = useStore();
  const { showDrawDreamerModal } = store;

  const closeModalHandler = () => {
    dispatch("SET_SHOWDRAWDREAMERMODAL", false);

    if (onClose) {
      onClose();
    }
  };

  let drawDreamerInfoBody;

  drawDreamerInfoBody = (
    <div>
      {/* <div>draw-dreamer-info</div> */}
      <div className="drawDreamerClose">
        <div>
          <span className="drawDreamerCloseButton"
          onClick={closeModalHandler}
          >
            X
          </span>
        </div>
      </div>
      <div className="drawDreamerInfoSection">
        <div className="drawDreamerInfoDexcription">
          At{" "}
          <a href={DRAWDREAMER_URL} target="_blank" noopener noreferrer>
            Kura Draw Dreamer
          </a>
          , user can generate various style of images that match with text input
          or user provided image input.
        </div>
        <div className="drawDreamerInfoImageContainer">
          <div>
            <Img className="drawDreamerInfoImage" src={TopImage2} />
          </div>
          <div>
            <Img className="drawDreamerInfoImage" src={TopImage1} />
          </div>
          <div>
            <Img className="drawDreamerInfoImage" src={TopImage5} />
          </div>
          <div>
            <Img className="drawDreamerInfoImage" src={TopImage3} />
          </div>
          <div>
            <Img className="drawDreamerInfoImage" src={TopImage4} />
          </div>
        </div>
      </div>

      <div className="drawDreamerInfoSection">
        <div className="drawDreamerInfoDexcription">
          It is possible to draw sketch images, and generate images using the
          sketches and text as guide.
        </div>
        <div>
          <div>
            <div className="drawDreamerInfoImageContainer">
              <div>
                <Img className="drawDreamerInfoImage" src={DrawImage1} />
              </div>
              <div>
                <Img className="drawDreamerInfoImage" src={DrawResultImage1} />
              </div>
            </div>
            <div className="drawDreamerInfoDexcription">
              an astronaut walking in forest
            </div>
          </div>
          <div>
            <div className="drawDreamerInfoImageContainer">
              <div>
                <Img className="drawDreamerInfoImage" src={DrawImage2} />
              </div>
              <div>
                <Img className="drawDreamerInfoImage" src={DrawResultImage2} />
              </div>
            </div>
            <div className="drawDreamerInfoDexcription">
              a panda sitting in the jungle
            </div>
          </div>
        </div>
      </div>

      <div className="drawDreamerInfoSection">
        <div className="drawDreamerInfoDexcription">
          Different style of images are generated by selecting style for
          generation.
        </div>
        <div>
          <div>
            <Img className="drawDreamerInfoImage" src={StyleImage1} />
          </div>
          <div className="drawDreamerInfoDexcription">
            a bed in room (photographic)
          </div>
        </div>
        <div>
          <div>
            <Img className="drawDreamerInfoImage" src={StyleImage2} />
          </div>
          <div className="drawDreamerInfoDexcription">
            a bed in room (fantasy art)
          </div>
        </div>
      </div>

      <div className="drawDreamerInfoSection">
        <div className="drawDreamerInfoDexcription">
          Images can be used as guide for image generation.
        </div>
        <div>
          <div>
            <div>
              <div>
                <div>
                  <Img className="drawDreamerInfoImage" src={ImageToImage1} />
                </div>
              </div>
              <div className="drawDreamerInfoDexcription">input</div>
              <div className="drawDreamerInfoImageContainer">
                <div>
                  <Img
                    className="drawDreamerInfoImage"
                    src={ImageToImage1Result1}
                  />
                </div>
                <div>
                  <Img
                    className="drawDreamerInfoImage"
                    src={ImageToImage1Result2}
                  />
                </div>
                <div>
                  <Img
                    className="drawDreamerInfoImage"
                    src={ImageToImage1Result3}
                  />
                </div>
              </div>
              <div className="drawDreamerInfoDexcription">outputs</div>
            </div>
            <div className="drawDreamerInfoImageContainer">
              <div>
                <div>
                  <Img className="drawDreamerInfoImage" src={ImageToImage2} />
                </div>
                input
              </div>
              <div>
                <div>
                  <Img
                    className="drawDreamerInfoImage"
                    src={ImageToImage2Result}
                  />
                </div>
                output
              </div>
            </div>
            <div className="drawDreamerInfoImageContainer">
              <div>
                <div>
                  <Img className="drawDreamerInfoImage" src={ImageToImage3} />
                </div>
                input
              </div>
              <div>
                <div>
                  <Img
                    className="drawDreamerInfoImage"
                    src={ImageToImage3Result}
                  />
                </div>
                output
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="drawDreamerInfoSection">
        <div className="drawDreamerInfoDexcription">
          More images are found{" "}
          <a href={DRAWDREAMER_URL} target="_blank" noopener noreferrer>
            at Kura Draw Dream page.
          </a>
        </div>
        <div className="drawDreamerInfoDexcription">
          Post generated images in this page. Or, store generated image for
          later usage{" "}
          <a href={`${KURAIMAGEPHOTO_URL}/about`} target="_blank" noopener noreferrer>
            at Kura Image Photo
          </a>
          .
        </div>
      </div>
    </div>
  );

  return (
    <Fragment>
      <Backdrop onClick={closeModalHandler} />
      <SmallModal style="modal">
        <div>
          {drawDreamerInfoBody}
        </div>
      </SmallModal>
    </Fragment>
  );
};

export default DrawDreamerInfo;
