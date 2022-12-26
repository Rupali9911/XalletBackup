export const ImagekitType = {
  AVATAR: 'avatar',
  PROFILE: 'profile',
  BANNER: 'banner',
  FULLIMAGE: 'fullImage',
};

const Imagekit = {
  avatar: '?tr=w-128,tr=h-128',
  profile: '?tr=w-256,tr=h-256',
  banner: '?tr=w-512,tr=h-512',
  fullImage: '?tr=w-1024,tr=h-1024',
};

export const getImageUri = (uri, type) => {
  let resolution = '';

  switch (type) {
    case ImagekitType.AVATAR:
      resolution = Imagekit.avatar;
      break;

    case ImagekitType.PROFILE:
      resolution = Imagekit.profile;
      break;

    case ImagekitType.BANNER:
      resolution = Imagekit.banner;
      break;

    case ImagekitType.FULLIMAGE:
      resolution = Imagekit.fullImage;
      break;
  }

  if (uri?.includes('ik.imagekit.io')) {
    uri = uri + resolution;
  }

  return uri;
};
