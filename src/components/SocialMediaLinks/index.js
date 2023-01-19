import React from 'react';
import {Linking, TouchableOpacity} from 'react-native';
import {SIZE, SVGS} from 'src/constants';
import CommonStyles from '../../constants/styles';

const socialMediaLinks = ({socialSiteData}) => {
  const {YouTubeIcon, WebIcon, Twitter, Instagram, DiscordIcon} = SVGS;

  const LinkingUrl = type => {
    let url;
    if (type === socialSiteData?.twitterSite) {
      url = 'https://twitter.com/' + socialSiteData?.twitterSite;
    } else if (type === socialSiteData?.instagramSite) {
      url = 'https://www.instagram.com/' + socialSiteData?.instagramSite;
    } else {
      url = /(http(s?)):\/\//i.test(type) ? type : 'https://' + type;
    }
    return Linking.openURL(url);
  };

  return (
    <>
      {socialSiteData?.twitterSite ? (
        <TouchableOpacity
          onPress={() => LinkingUrl(socialSiteData?.twitterSite)}>
          <Twitter width={SIZE(35)} height={SIZE(35)} />
        </TouchableOpacity>
      ) : null}
      {socialSiteData?.instagramSite ? (
        <TouchableOpacity
          style={{...CommonStyles.socialSiteButton}}
          onPress={() => LinkingUrl(socialSiteData?.instagramSite)}>
          <Instagram width={SIZE(35)} height={SIZE(35)} />
        </TouchableOpacity>
      ) : null}
      {socialSiteData?.youtube_site || socialSiteData?.youtubeSite ? (
        <TouchableOpacity
          style={{...CommonStyles.socialSiteButton}}
          onPress={() =>
            LinkingUrl(
              socialSiteData?.youtube_site || socialSiteData?.youtubeSite,
            )
          }>
          <YouTubeIcon width={SIZE(35)} height={SIZE(35)} />
        </TouchableOpacity>
      ) : null}
      {socialSiteData?.discordSite ? (
        <TouchableOpacity
          style={{...CommonStyles.socialSiteButton}}
          onPress={() => LinkingUrl(socialSiteData?.discordSite)}>
          <DiscordIcon width={SIZE(35)} height={SIZE(35)} />
        </TouchableOpacity>
      ) : null}
      {socialSiteData?.website ? (
        <TouchableOpacity
          style={{...CommonStyles.socialSiteButton}}
          onPress={() => LinkingUrl(socialSiteData?.website)}>
          <WebIcon width={SIZE(35)} height={SIZE(35)} />
        </TouchableOpacity>
      ) : null}
    </>
  );
};
export default socialMediaLinks;
