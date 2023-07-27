// const React = window.React = require('react');
import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next/hooks';
import MetaTags from 'react-meta-tags';

const HeadMetaTag = (props) => {

  const [t] = useTranslation('translation');

  const title = `${t('title.text01', 'Share Photos and Store Photos. Connect with People, Friends, Family by Talk & Group Talk')}`;

  const description = `watakura: Place for your memory & moments. Store and Share Your Photos. Connect with People by Talk & Group Talk, and much more`;

  return (
    <Fragment>
      <MetaTags>
        <title>{title}</title>
        <meta name="description" content={description} />
        {/* <title>Page 1</title>
        <meta name="description" content="Some description." />
        <meta property="og:title" content="MyApp" />
        <meta property="og:image" content="path/to/image.jpg" /> */}
      </MetaTags>
    </Fragment>
  );
}

export default HeadMetaTag;