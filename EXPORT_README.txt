BOUND TO TELL - COMPLETE WEBSITE EXPORT

Version: 48 (latest live version verified when this export was made)
Export date: October 27, 2026
Public website: https://boundtotell.com

CONTENTS

website/
  The complete, ready-to-upload website: Home, Packages, Sample &
  Testimonials, FAQs and Contact Us, with its images, fonts, scripts,
  phone and email links, sample viewer and printable package comparison.
  Existing phone, tablet and desktop styles are included unchanged.

source/
  Editable templates, text, package data, styles, scripts, assets,
  documentation and existing checks.

PREVIEW

Extract the entire ZIP, then open website/index.html in your browser.
Keep the files and folders together so images, fonts and navigation work.
Phone and email links use the apps available on your device.

UPLOAD TO A WEB HOST

Upload the CONTENTS of website/ to the host's public web folder, with
index.html at the website root. This is a static website; it does not
require a database, a server application or a ChatGPT login.
The source/ folder and this README do not need to be uploaded publicly.
Domain and email settings are managed separately with their providers.

EDIT AND REBUILD

With Node.js installed, open a terminal in source/ and run:
  node scripts/build.cjs

This produces source/dist/ containing the rebuilt website. Upload that
folder's contents after making changes. No package installation is needed.
Main copy: source/content/site-copy.json
Package details: source/content/packages.json
Page templates: source/src/render.cjs
Styles, scripts and assets: source/public/

SAVED EARLIER VERSIONS

The ready-to-upload folder also retains:
  website/previous/index.html
  website/versions/23/index.html
  website/versions/35/index.html

These are preserved older designs, not the current homepage.

The archive excludes Git history, hosting-account identity and credentials.
EXPORT_MANIFEST.json records the verified source commit and file hashes.
