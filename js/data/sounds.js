/*
 * Kerala Journey — district soundscapes. Play only when the visitor taps the sound button.
 *
 * Files live in assets/audio/ and come from Wikimedia Commons (Category:Audio files from Kerala).
 *   src – MP3, plays in every browser (Commons' own MP3 transcode of the original)
 *   ogg – optional smaller Ogg Vorbis original, used by browsers that can play it
 * Keep the credit fields: CC BY / BY-SA need title, author and license. `npm run media` copies
 * them into CREDITS.md. Districts without an entry simply have no sound button.
 */
window.KERALA_SOUNDS = {
  kannur: {
    src: "assets/audio/kannur-theyyam-drums.mp3",
    ogg: "assets/audio/kannur-theyyam-drums.ogg",
    label: "Theyyam drums",
    title: "Theyyam Meelam",
    author: "Manojk",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
    source: "https://commons.wikimedia.org/wiki/File:Theyyam_Meelam.ogg",
  },
  wayanad: {
    src: "assets/audio/wayanad-bulbul.mp3",
    ogg: "assets/audio/wayanad-bulbul.ogg",
    label: "Flame-throated bulbul, recorded in Wayanad",
    title: "Pycnonotus gularis, Wayanad, Kerala, India",
    author: "L. Shyamal",
    license: "CC BY 2.5",
    licenseUrl: "https://creativecommons.org/licenses/by/2.5",
    source: "https://commons.wikimedia.org/wiki/File:Pycnonotus_gularis,_Wayanad,_Kerala,_India.oga",
  },
  thrissur: {
    src: "assets/audio/thrissur-pandi-melam.mp3",
    ogg: "assets/audio/thrissur-pandi-melam.ogg",
    label: "Pandi melam, the drumming of the Pooram",
    title: "Pandi Melam",
    author: "Manojk",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
    source: "https://commons.wikimedia.org/wiki/File:Pandi_Melam.ogg",
  },
  ernakulam: {
    src: "assets/audio/ernakulam-chenda-melam.mp3",
    label: "Chenda melam, temple drums",
    title: "Chenda Melam",
    author: "Alexabraham22da",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
    source: "https://commons.wikimedia.org/wiki/File:Chenda_Melam.ogg",
  },
  idukki: {
    src: "assets/audio/idukki-hawk-cuckoo.mp3",
    label: "Common hawk-cuckoo, recorded in Kerala",
    title: "Common hawk-cuckoo 01a",
    author: "Vis M",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    source: "https://commons.wikimedia.org/wiki/File:Common_hawk-cuckoo_01a.wav",
  },
  kottayam: {
    src: "assets/audio/kottayam-stork-billed-kingfisher.mp3",
    label: "Stork-billed kingfisher, recorded in Kerala",
    title: "Stork Billed Kingfisher Sound 01",
    author: "Ganesh Mohan T",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    source: "https://commons.wikimedia.org/wiki/File:Stork_Billed_Kingfisher_Sound_01.wav",
  },
  alappuzha: {
    src: "assets/audio/alappuzha-kingfisher.mp3",
    label: "White-throated kingfisher, recorded at Cherthala",
    title: "White-throated kingfisher 01",
    author: "Vis M",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    source: "https://commons.wikimedia.org/wiki/File:White-throated_kingfisher_01.wav",
  },
};
