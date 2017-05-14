import axios from 'axios'
import cheerio from 'cheerio-without-node-native';

export const controllerNews = {
  getListNews: async (url, params = {}) => {
    try {
      let html = await axios({method: 'GET', url})
      if (html.status === 200) {
        $ = cheerio.load(html.data, {
          normalizeWhitespace: true
        })

        let listManga = []
        let listTypes = []
        let total = 0

        $('div.item_truyennendoc').each( function(index, element) {
          let manga = {}
          manga.image = $(element).find('img').attr('src')
          manga.title = $(element).find('h5.tentruyen_slide').text()
          manga.url = $(element).find('a').first().attr('href')
          manga.id =  manga.url.match(/-(.*).html/).pop()
          listManga.push(manga)
        })

        $('div#list_kw').find('a').each( function(index, element) {
          let url = $(element).attr('href')
          let title = $(element).text()
          listTypes.push({ url, title })
        })

        total = $('.pagination').find('a').length

        return { listManga, listTypes, total}
      } else {
        return null
      }
      
    } catch (e) {
      console.log(error)
      return null
    }
  },
  getListHot: async (url, params = {}) => {
    try {
      let html = await axios({method: 'GET', url: 'http://hamtruyen.vn/'})
      if (html.status === 200) {
        $ = cheerio.load(html.data, {
          normalizeWhitespace: true
        })

        let listManga = []

        $('#crsTruyenHotTrongNgay .item_truyennendoc').each( function(index, element) {
          let manga = {}
          manga.image = $(element).find('img').attr('src')
          manga.title = $(element).find('h5.tentruyen_slide').text()
          manga.chap = $(element).find('h5.tenchap_slide').text()
          manga.url = $(element).find('a').first().attr('href')
          manga.id =  manga.url.match(/-(.*).html/).pop()
          listManga.push(manga)
        })

        return listManga
      } else {
        return null
      }
    } catch (e) {
      console.log(error)
      return null
    }
  },
  getInformation: async (item) => {
    let html = await axios({method: 'GET', url: `http://hamtruyen.vn${item.url}`})
    if (html.status === 200) {
      $ = cheerio.load(html.data, {
        normalizeWhitespace: true
      })

      let category = $('p.row_theloai').text()
      let summary = $('p#tomtattruyen').text()
      let chaps = []
      $('div.nano section.row_chap').each( function(index, element) {
        let chap = {}
        let a = $(element).find('a')
        chap.date = $(element).find('div.ngaydang').text()
        chap.title = a.text()
        chap.url = a.attr('href')
        chaps.push(chap)
      })

      return { category, summary, chaps}
    } else {
      return null
    }
  },
  getManga: async (item) => {
    let html = await axios({method: 'GET', url: `http://hamtruyen.vn${item.url}`})
    if (html.status === 200) {
      $ = cheerio.load(html.data, {
        normalizeWhitespace: true
      })
      let pages = []
      let chaps = []
      let count = 1
      $('div#content_chap img').each( function(index, element) { 
        let page = $(element).attr('src')
        pages.push({page: count, image: page})
        count++
      });
      $('select#ddl_listchap_bottom').first().find('option').each( function(index, element) { 
        let chap = {}
        chap.title = String($(element).text())
        chap.url = '/doc-truyen/' + String($(element).attr('value')) + '.html'
        chaps.push(chap)
      });

      return { pages, chaps}
    } else {
      return null
    }
  }
}
