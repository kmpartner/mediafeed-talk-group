import React, { Component, Fragment, useState, useEffect } from "react";
import { withI18n } from "react-i18next";
// import Img from "react-cool-img";

import {
  EmailShareButton,
  EmailIcon,
  TwitterShareButton,
  TwitterIcon,
  TelegramShareButton,
  TelegramIcon,
  HatenaShareButton,
  HatenaIcon,
  WeiboShareButton,
  WeiboIcon,
  LineShareButton,
  LineIcon,
  FacebookShareButton,
  FacebookIcon,
  WhatsappShareButton,
  WhatsappIcon,
  XIcon,


  // GabShareButton,
  // GabIcon

  InstapaperShareButton,
  InstapaperIcon,

  LinkedinShareButton,
  LinkedinIcon,

  LivejournalShareButton,
  LivejournalIcon,

  MailruShareButton,
  MailruIcon,

  OKShareButton,
  OKIcon,

  PinterestShareButton,
  PinterestIcon,

  PocketShareButton,
  PocketIcon,

  RedditShareButton,
  RedditIcon,

  TumblrShareButton,
  TumblrIcon,

  ViberShareButton,
  ViberIcon,

  VKShareButton,
  VKIcon,

  WorkplaceShareButton,
  WorkplaceIcon,

} from 'react-share';

import { useStore } from "../../hook-store/store";

import { marks } from "../../images/marks";
import "./ShareButtons.css";

const ShareButtons = (props) => {
  const { 
    linkUrl, 
    showLink,
    content, 
    iconSize, 
    iconRound, 
    iconRadius,
  } = props;

  const [store, dispatch] = useStore();

  const shareUrl = linkUrl || "https://watakura.xyz";
  const postContent = content || "Share this ";
  const size = iconSize || 60;
  const round = iconRound || false;

  const [linkClicked, setLinkClicked] = useState(false);

  // const handleEmailOnClick = () => {
  //   window.location.href = encodeURI(`mailto:?subject=Subject Here&body=Hi,\n\nYou Can bla Bla bla`);
  // };
  const linkCopyHandler = (copyText) => {
    navigator.clipboard.writeText(copyText);

    setLinkClicked(true);

    setTimeout(() => {
      setLinkClicked(false);
    }, 1000*3)
  };

  let displayLink

  if (shareUrl) {
    displayLink = shareUrl.slice(0, 25) + '....'
  }


  let shareButtonsBody;

  shareButtonsBody = (
    <div>
      {showLink && (
        <div>
          {linkClicked && (
            <div className="shareButtonsLinkCopyResult">
              copied
            </div>
          )}
          <div className="shareButtonsLinkContainer">
              <span>
                {/* <div>
                  Link
                </div> */}
                <div title={shareUrl}>
                  {displayLink} 
                </div>
              </span>
              <span className="shareButtonsLinkCopyButton"
                title="copy" 
                onClick={() => {
                  linkCopyHandler(shareUrl);
                }}
              >
                {marks.copyMark}
              </span>
          </div>
        </div>
      )}
      <div className="shareButtonsContainer">
        <FacebookShareButton
          url={shareUrl}
          quote={`${postContent}`}
          // hashtag={'#portfolio...'}
        >
          <FacebookIcon size={size} round={round}/>
        </FacebookShareButton>

        <WhatsappShareButton
          url={shareUrl}
          title={`${postContent}`}
          // quote={``}
          // hashtag={'#portfolio...'}
        >
          <WhatsappIcon size={size} round={round} />
        </WhatsappShareButton>

        <TwitterShareButton
          url={shareUrl}
          title={`${postContent}`}
          // via='via content'
          // hashtag={'#portfolio...'}

          // quote={'Title or jo bhi aapko likhna ho'}
        >
          <XIcon size={size} round={round} />
        </TwitterShareButton>

        <TwitterShareButton
          url={shareUrl}
          title={`${postContent}`}
          // via='via content'
          // hashtag={'#portfolio...'}

          // quote={'Title or jo bhi aapko likhna ho'}
        >
          <TwitterIcon size={size} round={round} />
        </TwitterShareButton>

        <TelegramShareButton
          url={shareUrl}
          title={`${postContent}`}
          // quote={'Title or jo bhi aapko likhna ho'}
          // hashtag={'#portfolio...'}
        >
          <TelegramIcon size={size} round={round} />
        </TelegramShareButton>

        <LineShareButton
          url={shareUrl}
          title={`${postContent}`}
          // quote={'Title or jo bhi aapko likhna ho'}
          // hashtag={'#portfolio...'}
        >
          <LineIcon size={size} round={round} />
        </LineShareButton>

        <HatenaShareButton
          url={shareUrl}
          title={`${postContent}`}
          // quote={'Title or jo bhi aapko likhna ho'}
          // hashtag={'#portfolio...'}
        >
          <HatenaIcon size={size} round={round} />
        </HatenaShareButton>

        <WeiboShareButton
          url={shareUrl}
          title={`${postContent}`}
          // image={imagUrl}
          // quote={'Title or jo bhi aapko likhna ho'}
          // hashtag={'#portfolio...'}
        >
          <WeiboIcon size={size} round={round} />
        </WeiboShareButton>

        <InstapaperShareButton
          url={shareUrl}
          title={`${postContent}`}
        >
          <InstapaperIcon size={size} round={round} />
        </InstapaperShareButton>

        <LinkedinShareButton
          url={shareUrl}
          title={`${postContent}`}
        >
          <LinkedinIcon size={size} round={round} />
        </LinkedinShareButton>

        <LivejournalShareButton
          url={shareUrl}
          title={`${postContent}`}
        >
          <LivejournalIcon size={size} round={round} />
        </LivejournalShareButton>

        <MailruShareButton
          url={shareUrl}
          title={`${postContent}`}
        >
          <MailruIcon size={size} round={round} />
        </MailruShareButton>

        <OKShareButton
          url={shareUrl}
          title={`${postContent}`}
        >
          <OKIcon size={size} round={round} />
        </OKShareButton>

        <PinterestShareButton
          url={shareUrl}
          title={`${postContent}`}
        >
          <PinterestIcon size={size} round={round} />
        </PinterestShareButton>

        <PocketShareButton
          url={shareUrl}
          title={`${postContent}`}
        >
          <PocketIcon size={size} round={round} />
        </PocketShareButton>

        <RedditShareButton
          url={shareUrl}
          title={`${postContent}`}
        >
          <RedditIcon size={size} round={round} />
        </RedditShareButton>

        <TumblrShareButton
          url={shareUrl}
          title={`${postContent}`}
        >
          <TumblrIcon size={size} round={round} />
        </TumblrShareButton>

        <ViberShareButton
          url={shareUrl}
          title={`${postContent}`}
        >
          <ViberIcon size={size} round={round} />
        </ViberShareButton>

        <VKShareButton
          url={shareUrl}
          title={`${postContent}`}
        >
          <VKIcon size={size} round={round} />
        </VKShareButton>

        <WorkplaceShareButton
          url={shareUrl}
          title={`${postContent}`}
        >
          <WorkplaceIcon size={size} round={round} />
        </WorkplaceShareButton>

        <EmailShareButton
          url={shareUrl}
          // quote={'Title or jo bhi aapko likhna ho'}
          // hashtag={'#portfolio...'}
          subject="Share this"
          body="I share this..."
          // onClick={handleEmailOnClick}
        >
          <EmailIcon size={size} round={round} />
        </EmailShareButton>
      </div>
    </div>
  );
  

  return (
    <Fragment>
      {shareButtonsBody}

    </Fragment>
  );
};

export default withI18n()(ShareButtons);
// export default FeedEdit;
