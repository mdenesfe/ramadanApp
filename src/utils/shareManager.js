export class ShareManager {
  constructor() {
    this.buttons = this.setupButtons();
    this.setupEventListeners();
  }

  setupButtons() {
    return {
      shareButton: document.getElementById('shareButton'),
      shareButtonImsak: document.getElementById('shareButtonImsak'),
      shareAyetButton: document.getElementById('shareAyet')
    };
  }

  setupEventListeners() {
    const { shareButton, shareButtonImsak, shareAyetButton } = this.buttons;

    if (shareButton) {
      shareButton.addEventListener('click', () => this.shareRemainingTime('iftar'));
      this.updateButtonVisibility(shareButton);
    }

    if (shareButtonImsak) {
      shareButtonImsak.addEventListener('click', () => this.shareRemainingTime('imsak'));
      this.updateButtonVisibility(shareButtonImsak);
    }

    if (shareAyetButton) {
      shareAyetButton.addEventListener('click', () => this.shareVerseOfTheDay());
      this.updateButtonVisibility(shareAyetButton);
    }
  }

  updateButtonVisibility(button) {
    // Hide share buttons if sharing is not supported
    if (!this.isShareSupported()) {
      button.style.display = 'none';
    }
  }

  isShareSupported() {
    return typeof navigator !== 'undefined' && !!navigator.share;
  }

  async shareRemainingTime(type = 'iftar') {
    try {
      const citySelect = document.getElementById('citySelect');
      const remainingTime = document.getElementById(type === 'iftar' ? 'remainingToIftar' : 'remainingToImsak')?.textContent;
      
      if (!citySelect || !remainingTime) {
        throw new Error('Required elements not found');
      }

      const city = citySelect.value;
      const cityLabel = citySelect.options[citySelect.selectedIndex].text;
      const shareText = this.formatShareText(cityLabel, type, remainingTime);

      await this.share(type === 'iftar' ? 'İftar Vakti' : 'İmsak Vakti', shareText);
    } catch (error) {
      console.error('Error sharing remaining time:', error);
      this.handleShareError();
    }
  }

  formatShareText(city, type, remainingTime) {
    const messages = {
      iftar: {
        emoji: '🌙 İFTAR VAKTİ',
        text: `━━━━━━━━━━━━━━━\n${city} için iftara:\n⏱️ ${remainingTime}\n━━━━━━━━━━━━━━━\n\n🤲 "Oruç bir kalkandır. Oruçlu, kötü söz söylemesin ve kavga etmesin."\n— (Buhârî)\n\n📱 Takip et: https://ramazan.app\n\n#Ramazan2025 #İftar #${city.replace(/İ/g, 'I').replace(/ı/g, 'i')}`
      },
      imsak: {
        emoji: '🌅 İMSAK VAKTİ',
        text: `━━━━━━━━━━━━━━━\n${city} için imsak:\n⏱️ ${remainingTime}\n━━━━━━━━━━━━━━━\n\n🤲 "Sahurda bereket vardır. Bir yudum su ile dahi olsa sahuru terk etmeyiniz."\n— (Müslim)\n\n📱 Takip et: https://ramazan.app\n\n#Ramazan2025 #Sahur #${city.replace(/İ/g, 'I').replace(/ı/g, 'i')}`
      }
    };

    const { emoji, text } = messages[type];
    return `${emoji}\n${text}`;
  }

  async shareVerseOfTheDay() {
    try {
      const verse = document.getElementById('gununAyeti')?.textContent.replace('📖 ', '');
      const surah = document.getElementById('gununAyetiSure')?.textContent;

      if (!verse || !surah) {
        throw new Error('Verse content not found');
      }

      const shareText = `📖 GÜNÜN AYETİ\n━━━━━━━━━━━━━━━\n\n${verse}\n\n${surah}\n\n✨ "Andolsun ki, Kur'an'ı düşünüp öğüt almak için kolaylaştırdık."\n— (Kamer, 17)\n\n📱 Takip et: https://ramazan.app\n\n#Ramazan2025 #GününAyeti #KuranıKerim`;
      await this.share('Günün Ayeti', shareText);
    } catch (error) {
      console.error('Error sharing verse:', error);
      this.handleShareError();
    }
  }

  async share(title, text) {
    if (!this.isShareSupported()) {
      throw new Error('Share API not supported');
    }

    try {
      await navigator.share({
        title,
        text,
        url: 'https://ramazan.app'
      });
      console.log('Successfully shared!');
    } catch (error) {
      if (error.name !== 'AbortError') {
        // Only log if it's not a user cancellation
        console.error('Share error:', error);
        throw error;
      }
    }
  }

  handleShareError() {
    const message = this.isShareSupported() 
      ? 'Paylaşım sırasında bir hata oluştu. Lütfen tekrar deneyin.'
      : 'Tarayıcınız paylaşım özelliğini desteklemiyor.';
    
    this.showToast(message);
  }

  showToast(message) {
    // Create and show a temporary toast message
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg transition-opacity duration-300';
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
} 