"use strict";

var vod = {

  verses: [
    {
      arabic: 'وَأَتِمُّوا الْحَجَّ وَالْعُمْرَةَ لِلَّهِ',
      style: 'color: black;margin-top:8%;',
      background: 'mecca.jpg',
      href: '/quran/2/196',
      attrib: 'Al-Quran'
    },
    { 
      arabic: 'أَلَا بِذِكْرِ ٱللَّهِ تَطْمَئِنُّ ٱلْقُلُو',
      href:'/quran/13/28', 
      attrib: 'Al-Quran' 
    },
    {
      arabic: 'وَنَحْنُ أَقْرَبُ إِلَيْهِ مِنْ حَبْلِ ٱلْوَرِيدِ',
      href: '/quran/50/16',
      attrib: 'Al-Quran' 
    },
    {
      arabic: 'أَفَلَا يَتَدَبَّرُونَ ٱلْقُرْءَانَ',
      href: '/quran/4/82',
      attrib: 'Al-Quran' 
    },
    {
      arabic: 'فَإِذَا عَزَمْتَ فَتَوَكَّلْ عَلَى ٱللَّهِ',
      href: '/quran/3/159',
      attrib: 'Al-Quran'
    },
    {
      arabic: 'إِنَّا لِلَّهِ وَإِنَّآ إِلَيْهِ رَٰجِعُونَ',
      href: '/quran/2/156',
      attrib: 'Al-Quran'
    },
    {
      arabic: 'أَوَلَمْ يَتَفَكَّرُوا۟ فِىٓ أَنفُسِهِم',
      href: '/quran/30/8',
      attrib: 'Al-Quran'
    },
    {
      arabic: 'كِتَٰبٌ أَنزَلْنَٰهُ إِلَيْكَ مُبَٰرَكٌ لِّيَدَّبَّرُوٓا۟ ءَايَٰتِهِ',
      href: '/quran/38/29',
      attrib: 'Al-Quran'
    },
    {
      arabic: 'وَٱذْكُر رَّبَّكَ إِذَا نَسِيتَ ',
      href: '/quran/18/24',
      attrib: 'Al-Quran'
    },
    {
      arabic: 'فَٱذْكُرُونِىٓ أَذْكُرْكُمْ',
      href: '/quran/2/152',
      attrib: 'Al-Quran'
    }
  ],

  get: function(req,res,next) {
    var l = vod.verses.length;
    var i = 0 ; // ((Math.random()*l)|0)%l;
    req.verseofday = vod.verses[i];
    
    req.verseofday.background = vod.verses[i].background || 'quranlight.jpg';
    req.verseofday.style = vod.verses[i].style || '';

    next();
  }

};

module.exports = vod;
