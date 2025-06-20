const fs = require('fs');
const https = require('https');
const path = require('path');
const { URL } = require('url');

const tools = [
  {
    name: 'Mixpanel',
    logo_url: 'https://wpforms.com/wp-content/uploads/cache/integrations/669824a815a36cb6bd5a186e312362d0.png'
  },
  {
    name: 'Heap',
    logo_url: 'https://media.licdn.com/dms/image/v2/C560BAQEFnYhpwGfSgQ/company-logo_200_200/company-logo_200_200/0/1656698401379/heap_inc__logo?e=2147483647&v=beta&t=mt5YBp7KVr_NnZkd_uTUYXxQZiyPrCHJw0vkDl84Nms'
  },
  {
    name: 'FullStory',
    logo_url: 'https://pbs.twimg.com/profile_images/1777355268914880514/dauQYrko_400x400.png'
  },
  {
    name: 'Pendo',
    logo_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKBgKJZqdUw2mDqBg_AOvT2AppN67ki4BTuw&s'
  },
  {
    name: 'Amplitude',
    logo_url: 'https://pipedream.com/s.v0/app_XBxh84/logo/orig'
  },
  {
    name: 'Hotjar',
    logo_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1bFokFT723dhAIqi7w6H1dBpxLQVmOcEuCg&s'
  },
  {
    name: 'PostHog',
    logo_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkTqteImyGlzQIJou-nJ18ymYPuGUsMP-ufw&s'
  },
  {
    name: 'LogRocket',
    logo_url: 'https://avatars.githubusercontent.com/u/19847951?s=280&v=4'
  },
  {
    name: 'Google Analytics 4',
    logo_url: 'https://thumbs.dreamstime.com/b/google-analytics-logo-white-background-editorial-illustrative-vector-eps-aab-210442257.jpg'
  },
  {
    name: 'Indicative',
    logo_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIOZ-r8tKdgjI3OVt_Mr6iYAHzFyM9NVc3iw&s'
  },
  {
    name: 'UXTweak',
    logo_url: 'https://media.licdn.com/dms/image/v2/D4E0BAQF5cgbwKM4STw/company-logo_200_200/company-logo_200_200/0/1735549240945/uxtweak_logo?e=2147483647&v=beta&t=P4RHCxfBc4KYDKnQyxUSCxP7b3vzs3S1O82AunU4CFs'
  },
  {
    name: 'UserTesting',
    logo_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSbfGbzsa1YDRuz2i8lASWjpgHIIDUcZsBIA&s'
  },
  {
    name: 'OptimalWorkshop',
    logo_url: 'https://s3-eu-west-1.amazonaws.com/tpd/logos/5ea0be00c8fa500001d66f46/0x0.png'
  },
  {
    name: 'Userlytics',
    logo_url: 'https://media.licdn.com/dms/image/v2/C560BAQEh9XKQIckqRQ/company-logo_200_200/company-logo_200_200/0/1630653970170/userlytics_corporation_logo?e=2147483647&v=beta&t=OA8gJ8ELxSGBAHGahfdQMr6U5N4MNjECy1lX_9e9y3s'
  },
  {
    name: 'UserZoom',
    logo_url: 'https://play-lh.googleusercontent.com/vMJLnhpp2o5C_3DPx1uEsRTRFfRMrexkOzjiVF7ur5Pl9Sggi3WkX0jJGOdlP6BKoIU'
  },
  {
    name: 'UsabilityHub',
    logo_url: 'https://images.crunchbase.com/image/upload/c_pad,h_256,w_256,f_auto,q_auto:eco,dpr_1/v1483255561/aytjj7udluwjgpc4ihds.png'
  },
  {
    name: 'Userfeel',
    logo_url: 'https://play-lh.googleusercontent.com/__oe1K8_HdDduUSXsAEzAJ6pu9qIhNbqcoD8urRdQV9FGHepDF6gVXI8BKr2KDFfAXQ'
  },
  {
    name: 'Maze',
    logo_url: 'https://www.datocms-assets.com/38511/1627404461-publisherlogo.jpg?auto=format'
  },
  {
    name: 'Userbrain',
    logo_url: 'https://pbs.twimg.com/profile_images/1415626812655382534/nY_VOgmF_400x400.jpg'
  },
  {
    name: 'Lookback',
    logo_url: 'https://pbs.twimg.com/profile_images/1458835361036181504/DArHdgHN_400x400.png'
  }
];

const downloadImage = (url, name) => {
  return new Promise((resolve, reject) => {
    const fileName = `${name.toLowerCase()}.png`;
    const filePath = path.join(__dirname, '../public/tools-logos', fileName);

    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${name}: ${response.statusCode}`));
        return;
      }

      const fileStream = fs.createWriteStream(filePath);
      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`Downloaded: ${fileName}`);
        resolve();
      });
    }).on('error', (err) => {
      reject(new Error(`Error downloading ${name}: ${err.message}`));
    });
  });
};

async function downloadAllLogos() {
  try {
    for (const tool of tools) {
      try {
        await downloadImage(tool.logo_url, tool.name);
      } catch (err) {
        console.error(err.message);
      }
    }
    console.log('All downloads completed!');
  } catch (err) {
    console.error('Error in main process:', err);
  }
}

downloadAllLogos(); 