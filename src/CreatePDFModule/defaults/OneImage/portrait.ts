import { pWidth, pHeight } from '@constants/constants';
import { createField, createImage, createLineBlock } from '@defaults/functions';
import { img_width, img_height } from '@defaults/OneImage/oneImage';

const img_x = (pWidth - img_width) / 2;
const img_y = pHeight - 50 - img_height;

const ln_x1 = img_x;
const ln_x2 = img_x + img_width;
// const ln_y = img_y - img_height - 40;
const ln_y = img_y - 200;

// TODO: Add empty, field and lines to oneimage

export const d1_nothing_portrait = {
  id: 10,
  name: 'Default 1 Nothing Portrait',

  pages: [
    {
      pageN: {
        x: pWidth - 50,
        y: 30,
        size: 12,
      },
      dim: [pWidth, pHeight],

      images: [createImage(img_x, img_y, img_width, img_height)],
    },
  ],
};

export const d1_print_portrait = {
  id: 11,
  name: 'Default 1 Print Portrait',

  pages: [
    {
      pageN: {
        x: pWidth - 50,
        y: 30,
        size: 12,
      },
      dim: [pWidth, pHeight],

      // FIXME: line doesn't work.
      lines: [...createLineBlock(ln_x1, ln_x2, ln_y, ln_y)],

      images: [createImage(img_x, img_y, img_width, img_height)],
    },
  ],
};

export const d1_digital_portrait = {
  id: 12,
  name: 'Default 1 Digital Portrait',

  pages: [
    {
      pageN: {
        x: pWidth - 50,
        y: 30,
        size: 12,
      },
      dim: [pWidth, pHeight],

      fields: [createField(ln_x1, ln_x2, img_width, img_height)],

      images: [createImage(img_x, img_y, img_width, img_height)],
    },
  ],
};
