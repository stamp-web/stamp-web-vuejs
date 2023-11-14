import { reactive } from 'vue'
import type { Album, Country } from '../models/entityModels'
import CountryService from '../services/CountryService'
import AlbumService from '../services/AlbumService'
import { defineStore } from 'pinia'
import { EntityList } from '../models/entityList'

import {sortedIndexBy} from 'lodash-es'
export const modelStore = defineStore('models', {
  state: () => {
    return {
      countries: reactive({ list: [] as Country[], total: 0, loading: false }),
      albums: reactive({ list: [] as Album[], total: 0, loading: false })
    }
  },
  getters: {
    loading: (state) => {
      return state.countries.loading || state.albums.loading
    }
  },
  actions: {
    async getCountries(): Promise<Country[]> {
      if (this.countries.list.length === 0) {
        this.countries.loading = true
        const data: EntityList<Country> = await CountryService.find()
        this.countries.list = data.items
        this.countries.total = data.total
        this.countries.loading = false
        return Promise.resolve(data.items)
      } else {
        return Promise.resolve(this.countries.list)
      }
    },

    async getAlbums(): Promise<Album[]> {
      if (this.albums.list.length === 0) {
        this.albums.loading = true
        const data: EntityList<Album> = await AlbumService.find()
        this.albums.list = data.items
        this.albums.total = data.total
        this.albums.loading = false
        return Promise.resolve(data.items)
      } else {
        return Promise.resolve(this.albums.list)
      }
    },

    async createCountry(m: Country): Promise<Country> {
      const country = await CountryService.create(m)
      let index = sortedIndexBy(this.countries.list, country, (m: Country) => m)
      if (index < 0) {
        index = this.countries.list.length - 1
      }
      this.countries.list.splice(index, 0, country)
      this.countries.total++
      return country
    },
    async removeCountry(country: Country): Promise<void> {
      const id = country.id
      return CountryService.remove(country).then(() => {
        const indx = this.countries.list.findIndex((e) => {
          return e.id === id
        })
        if (indx >= 0) {
          this.countries.list.splice(indx, 1)
          this.countries.total--
        }
      })
    },

    async removeAlbum(album: Album): Promise<void> {
      const id = album.id
      return AlbumService.remove(album).then(() => {
        const indx = this.albums.list.findIndex((e) => {
          return e.id === id
        })
        if (indx >= 0) {
          this.albums.list.splice(indx, 1)
          this.albums.total--
        }
      })
    }
  }
})
