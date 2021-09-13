/**
 * TO-DO
 * 1. Render songs
 * 2. Scroll top
 * 3. Play / pause / seek
 * 4. CD rotate
 * 5. Next / prev
 * 6. Random
 * 7. Next / Repeat when ended
 * 8. Active song
 * 9. Scroll active song into view
 * 10. Play song when click
 */

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const playList = $('.list-song')
const playListPlace = $('.playlist')
const cdElement = $('.cd')
const cdThumb = $('.header-img')
const audioElement = $('#audio')
const playBtnElement = $('.controller-play')
const nextBtnElement = $('.controller-next')
const backBtnElement = $('.controller-back')
const syscBtnElement = $('.controller-sysc')
const randomBtnElement = $('.controller-random')
const nameSongHeader = $('.header-song-name')
const progressElement = $('#progress')
const volumeProgressElement = $('#volume_progress')
const volumeIconElement = $('.volume__icon')
var listItemsElement 

var currentSong = 0
var isPlaying = false
var isRandom = false
var isSyncing = false
var isProgressOnInput = false
var isMute = false
var timeOut

var player = {
    songs: [
    	{
            songName: 'Calling My Phone',
            auther: 'Lil Tjay',
            path: "music/Lil Tjay - Calling My Phone (feat. 6LACK) [Official Video].mp3",
            image: 'img/LilTjay-CallingMyPhone.jpg'
        },
   	{
            songName: 'Lovely',
            auther: 'Billie Eilish, Khalid',
            path: "music/Billie Eilish, Khalid - lovely.mp3",
            image: 'img/BillieEilish,Khalid-lovely.jpg'
        },
        {
            songName: 'Beggin\'',
            auther: 'Maneskin',
            path: "music/Maneskin-Beggin(LyricsTesto).mp3",
            image: 'img/Måneskin.jpg'
        },
        {
            songName: 'Uptown Funk',
            auther: 'Mark Ronson',
            path: 'music/Mark_Ronson-Uptown_Funk-ft. Bruno_Mars.mp3',
            image: 'img/MarkRonson-UptownFunk.jpg'
        },
        {
            songName: 'Peaches',
            auther: 'Justin Bieber',
            path: 'music/JustinBieber-Peaches.mp3',
            image: 'img/JustinBieber-Peaches.jpg'
        },
        {
            songName: 'Shape of You',
            auther: 'Ed Sheeran',
            path: 'music/Ed_Sheeran-Forme_de_vous-Want_Your_Love.mp3',
            image: 'img/Shape_of_You_cover.jpg'
        },
        {
            songName: 'Talking to the Moon',
            auther: 'Bruno Mars',
            path: 'music/Sickick-TalkingtotheMoon(BrunoMarsRemix).mp3',
            image: 'img/TalkingtotheMoon.jpg'
        },
        {
            songName: 'STAY',
            auther: 'Justin Bieber',
            path: 'music/TheKidLAROI,JustinBieber-STAY(LookasRemix).mp3',
            image: 'img/The_Kid_Laroi_and_Justin_Bieber_-_Stay.png'
        },
        {
            songName: 'Save Your Tears',
            auther: 'Weekend',
            path: 'music/TheWeeknd&ArianaGrande-SaveYourTears(Remix)(OfficialVideo).mp3',
            image: 'img/weekend.jpg'
        },
        {
            songName: 'Dance Monkey',
            auther: 'Tones and I',
            path: 'music/Tones and I - Dance Monkey (Lyrics).mp3',
            image: 'img/danceMonkey.jpg'
        },
    ],
    changeInfoPlayer: function (indexSong) {
        let _this = this
        this.songs.forEach(function (song, index) {
            if (index === indexSong) {
                audioElement.setAttribute('src', song.path)
                nameSongHeader.textContent = song.songName
                cdThumb.setAttribute('style', `background-image: url(${song.image})`)
            }
        })
    },
    handleFunction: function () {
        const _this = this
        const cdWidth = cdElement.offsetWidth
        const iconPlayBtn = $('.controller-play i')

        // spin cd animation
        const cdAnimation = cdThumb.animate([{ transform: 'rotate(360deg)' }], {
            duration: 10000, // 10 seconds
            iterations: Infinity
        })

        cdAnimation.pause()

        function playSong() {
            iconPlayBtn.setAttribute('class', 'fas fa-pause')
            audioElement.play()
            cdAnimation.play()
            isPlaying = true
        }

        function stopSong() {
            iconPlayBtn.setAttribute('class', 'fas fa-play')
            audioElement.pause()
            cdAnimation.pause()
            isPlaying = false
        }

        function randomSong() {
            oldSong = currentSong
            while (currentSong === oldSong) {
                currentSong = Math.floor(Math.random() * _this.songs.length)
            }
            return currentSong
        }

        function syscSong() {
            return currentSong
        }

        function nextSong() {
            if (isRandom) {
                currentSong = randomSong()
            } else {
                if (currentSong < _this.songs.length - 1) {
                    currentSong++
                } else {
                    currentSong = 0
                }
            }
        }

        function backSong() {
            if (isRandom) {
                currentSong = randomSong()
            } else {
                if (currentSong > 0) {
                    currentSong--
                } else {
                    currentSong = _this.songs.length - 1
                }
            }
        }

        function nextSongWhenDone() {
            if (audioElement.currentTime === audioElement.duration) {
                if (isSyncing) {
                    _this.renderPage()
                    playSong()
                } else {
                    nextSong()
                    _this.renderPage()
                    playSong()
                }
            }
        }

        function resetProgress() {
            progressElement.valueAsNumber = 0
        }

        function autoScrollSongToView() {
            listItemsElement.forEach(function(item, index) {
                if (index === currentSong) {
                    item.scrollIntoView({
                        behavior: "smooth",
                        block: "end"
                    })
                }
            })
        }

        function autoScrollAfterFiveSecond() {
            clearTimeout(timeOut)
            timeOut = setTimeout(() => {
                autoScrollSongToView()
            }, 5000);  
        }

        playListPlace.onscroll = function () {
            let scrollTop = playListPlace.scrollTop
            let newCdWidth = cdWidth - scrollTop
            cdElement.style.width = newCdWidth >= 0 ? newCdWidth + 'px' : 0
            cdElement.style.opacity = newCdWidth / cdWidth
        }

        playBtnElement.onclick = function () {
            if (isPlaying) {
                stopSong()
            } else {
                playSong()
            }
        }

        nextBtnElement.onclick = function () {
            nextSong()
            _this.renderPage()
            playSong()
            resetProgress()
            autoScrollAfterFiveSecond()            
        }

        backBtnElement.onclick = function () {
            if (audioElement.currentTime <= 1) {
                backSong()
                _this.renderPage()
                playSong()
            } else {
                audioElement.currentTime = 0
            }
            resetProgress()
            autoScrollAfterFiveSecond()
        }

        randomBtnElement.onclick = function () {
            this.classList.toggle('active_btn')
            isRandom = isRandom ? false : true
        }

        syscBtnElement.onclick = function () {
            this.classList.toggle('active_btn')
            isSyncing = isSyncing ? false : true
        }

        playList.onclick = function (e) {
            // event.target : lấy phần tử bị click trúng nằm trong playlist
            // .closest : lấy ra lớp nó hoặc lớp cha gần nhất của nó có class = song-item
            // :not(.active) : không có chứa class active
            const songItem = e.target.closest('.song-item:not(.active)')
            const indexSongItem = parseInt(songItem.dataset.index)
            if (songItem || 0 && indexSongItem || 0) {
                currentSong = indexSongItem
                songItem.scrollIntoView({
                    behavior: "smooth",
                     block: "nearest"
                })
                resetProgress()
                _this.renderPage()
                playSong()
            }
        }

        progressElement.onchange = function () {
            audioElement.currentTime = progressElement.valueAsNumber * audioElement.duration / 100
            isProgressOnInput = false
        }

        progressElement.oninput = function () {
            isProgressOnInput = true
        }

        audioElement.ontimeupdate = function () {
            currentTimeOfSonginPercent = audioElement.currentTime * 100 / audioElement.duration
            if (currentTimeOfSonginPercent) {
                if (!isProgressOnInput)
                    progressElement.valueAsNumber = currentTimeOfSonginPercent
                nextSongWhenDone()
            }
        }

        volumeProgressElement.oninput = function () {
            if (this.valueAsNumber === 0) {
                volumeIconElement.classList.remove('fa-volume-up')
                volumeIconElement.classList.add('fa-volume-off')
            }
            else{
                volumeIconElement.classList.add('fa-volume-up')
                volumeIconElement.classList.remove('fa-volume-off')
            }
            audioElement.volume = this.valueAsNumber / 100
        }

        volumeIconElement.onclick = function () {
            if (volumeProgressElement.valueAsNumber > 0) {
                if (isMute){
                    audioElement.volume = volumeProgressElement.valueAsNumber / 100
                    isMute = false
                    volumeIconElement.classList.add('fa-volume-up')
                    volumeIconElement.classList.remove('fa-volume-off')
                }
                else {
                    audioElement.volume = 0
                    isMute = true
                    volumeIconElement.classList.remove('fa-volume-up')
                    volumeIconElement.classList.add('fa-volume-off')
                }
            }
            
        }
    },
    renderPage: function () {
        _this = this
        let htmls = this.songs.map(function (song, index) {
            let active = index === this.currentSong ? 'active' : ''
            return `<li class="song-item ${active}" data-index="${index}">
                        <div class="song-item__logo" style="background-image: url(${song.image});">
                        </div>
                        <div class="song-item__content">
                            <div class="song-item__name">${song.songName}</div>
                            <div class="song-item__auther">${song.auther}</div>
                        </div>
                    </li>`
        })
        playList.innerHTML = htmls.join('')
        this.changeInfoPlayer(currentSong)
        listItemsElement = $$('.song-item')
        audioElement.volume = volumeProgressElement.valueAsNumber / 100
    },
    start: function () {
        this.handleFunction()
        this.renderPage()
    }
}

player.start()
