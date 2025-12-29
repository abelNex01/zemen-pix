import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import imageCompression from 'browser-image-compression';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  Settings2, 
  CheckCircle2, 
  Download, 
  X, 
  RefreshCcw,
  Zap,
  Shield,
  Smartphone,
  Heart
} from 'lucide-react';
import { useTrackOptimization } from '@/hooks/use-stats';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { StatsCard } from '@/components/StatsCard';
import { ComparisonSlider } from '@/components/ComparisonSlider';
import Ad from './Ad';
import Donation from './Donation';
import Pricing from './Pricing';
import { useLanguage } from '@/hooks/use-language';
import { ImageDeck } from '@/components/ImageDeck';
import { sharpenImage } from '@/lib/image-enhancer';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { containerVariants, itemVariants, revealViewport } from '@/lib/animations';


type CompressionOptions = {
  maxSizeMB: number;
  maxWidthOrHeight: number;
  useWebWorker: boolean;
  fileType: string;
};



function FeatureCard({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <motion.div 
      variants={itemVariants}
      className="p-6 rounded-2xl bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors"
    >
      <div className="w-12 h-12 bg-background rounded-xl flex items-center justify-center mb-4 shadow-sm border border-border">
        <Icon className="w-6 h-6 text-foreground" />
      </div>
      <h3 className="text-lg font-bold font-display mb-2">{title}</h3>
      <p className="text-muted-foreground leading-relaxed text-sm">{desc}</p>
    </motion.div>
  );
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
  const [optimizedFile, setOptimizedFile] = useState<File | null>(null);
  const [optimizedPreview, setOptimizedPreview] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  

  const [quality, setQuality] = useState(0.8);
  const [maxWidth, setMaxWidth] = useState(1920);
  const [format, setFormat] = useState('image/jpeg');


  const [isAdOpen, setIsAdOpen] = useState(false);
  const [isDonationOpen, setIsDonationOpen] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isSharpenEnabled, setIsSharpenEnabled] = useState(false);

  const { t } = useLanguage();

  const { mutate: trackStats } = useTrackOptimization();


  useEffect(() => {
    const hasSeenAd = sessionStorage.getItem('zemenpix_ad_shown');
    if (!hasSeenAd) {
      const timer = setTimeout(() => {
        setIsAdOpen(true);
        sessionStorage.setItem('zemenpix_ad_shown', 'true');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      setFile(selectedFile);
      setOriginalPreview(URL.createObjectURL(selectedFile));
      setOptimizedFile(null); // Reset previous optimization
      setOptimizedPreview(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/webp': []
    },
    maxFiles: 1
  });


  const compressImage = async () => {
    if (!file) return;

    setIsCompressing(true);
    try {
      const options: CompressionOptions = {
        maxSizeMB: 1, // Rough estimate, controlled by quality mainly
        maxWidthOrHeight: maxWidth,
        useWebWorker: true,
        fileType: format,
      };

      // Workaround: browser-image-compression doesn't strictly adhere to quality 0-1 param easily for all types
      // so we use a combination of techniques or just accept library limitations.
      // For this demo, we'll rely on the library's defaults + our options.
      
      const compressedBlob = await imageCompression(file, options);
      let finalBlob: Blob | File = compressedBlob;

      if (isSharpenEnabled) {
        const sharpenedBlob = await sharpenImage(compressedBlob);
        finalBlob = sharpenedBlob;
      }

      const compressedFile = new File([finalBlob], file.name, { type: format });
      
      setOptimizedFile(compressedFile);
      setOptimizedPreview(URL.createObjectURL(compressedFile));

      // Track stats
      trackStats({
        originalSize: file.size,
        optimizedSize: compressedFile.size,
        format: format.split('/')[1],
        quality: Math.round(quality * 100)
      });

    } catch (error) {
      console.error(error);
    } finally {
      setIsCompressing(false);
    }
  };


  useEffect(() => {
    if (file) {
      const timer = setTimeout(() => {
        compressImage();
      }, 500); // Debounce settings changes
      return () => clearTimeout(timer);
    }
  }, [file, quality, maxWidth, format, isSharpenEnabled]);

  const reset = () => {
    setFile(null);
    setOriginalPreview(null);
    setOptimizedFile(null);
    setOptimizedPreview(null);
  };

  const downloadImage = () => {
    if (!optimizedFile) return;
    const link = document.createElement('a');
    link.href = URL.createObjectURL(optimizedFile);
    link.download = `optimized-${file?.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary selection:text-primary-foreground">
      <Header onPricingClick={() => setIsPricingOpen(true)} />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        

        <section className="text-center py-4 md:py-8 mt-20 max-w-6xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            viewport={revealViewport}
          >
            <motion.h1 
              variants={itemVariants}
              className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-0 bg-gradient-to-br from-foreground via-foreground/80 to-foreground/40 bg-clip-text text-transparent"
            >
              {t('hero.title.top')}<br />{t('hero.title.bottom')}
            </motion.h1>

            <motion.div variants={itemVariants}>
              <ImageDeck />
            </motion.div>

            <motion.p 
              variants={itemVariants}
              className="text-sm md:text-base text-muted-foreground mb-4 max-w-2xl mx-auto leading-relaxed"
            >
              {t('hero.subtitle')}
            </motion.p>
            
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
            >
              <Button 
                onClick={() => setIsDonationOpen(true)}
                icon={<Heart className="w-5 h-5 fill-red-600" />}
                className="bg-red-500/10 text-red-600 hover:bg-red-500/20 pr-8"
              >
                {t('hero.donate')}
              </Button>
              <Button 
                onClick={() => {
                  const el = document.getElementById('tool');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {t('hero.getStarted')}
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={revealViewport}
          >
            <StatsCard />
          </motion.div>
        </section>


        <section id="tool" className="max-w-5xl mx-auto mb-32">
          {!file ? (
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div
                {...getRootProps()}
                className={`
                  group relative border-2 border-dashed rounded-3xl p-12 md:p-20 text-center cursor-pointer
                  transition-all duration-300 ease-in-out
                  ${isDragActive 
                    ? 'border-primary bg-primary/5 scale-[1.01]' 
                    : 'border-border hover:border-primary/50 hover:bg-muted/30'
                  }
                `}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center gap-6">
                  <div className="w-20 h-20 bg-background rounded-full shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Upload className="w-8 h-8 text-foreground" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-display font-bold mb-2">{t('tool.dropzone.title')}</h3>
                    <p className="text-muted-foreground">{t('tool.dropzone.subtitle')}</p>
                  </div>
                  <div className="flex gap-3 text-xs text-muted-foreground uppercase tracking-widest mt-4">
                    <span className="bg-secondary px-3 py-1 rounded-full">JPG</span>
                    <span className="bg-secondary px-3 py-1 rounded-full">PNG</span>
                    <span className="bg-secondary px-3 py-1 rounded-full">WEBP</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-card border border-border rounded-3xl overflow-hidden shadow-xl shadow-black/5"
            >

              <div className="border-b border-border bg-muted/20 p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <button onClick={reset} className="p-2 hover:bg-muted rounded-full transition-colors" title="Start Over">
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                  <div className="h-6 w-px bg-border mx-2 hidden md:block"></div>
                  <h3 className="font-semibold truncate max-w-[200px]">{file.name}</h3>
                </div>


                <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                  <div className="flex items-center gap-2 bg-background border border-border rounded-lg px-3 py-2">
                    <Settings2 className="w-4 h-4 text-muted-foreground" />
                    <select 
                      value={format} 
                      onChange={(e) => setFormat(e.target.value)}
                      className="bg-transparent border-none text-sm font-medium focus:ring-0 cursor-pointer outline-none"
                    >
                      <option value="image/jpeg">JPEG</option>
                      <option value="image/png">PNG</option>
                      <option value="image/webp">WEBP</option>
                    </select>
                  </div>

                  <button
                    onClick={() => setIsSharpenEnabled(!isSharpenEnabled)}
                    className={`
                      flex items-center gap-2 px-3 py-2 rounded-lg border transition-all
                      ${isSharpenEnabled 
                        ? 'bg-primary/10 border-primary text-primary shadow-sm' 
                        : 'bg-background border-border text-muted-foreground hover:border-primary/50'
                      }
                    `}
                    title={t('tool.sharpen')}
                  >
                    <Sparkles className={`w-4 h-4 ${isSharpenEnabled ? 'fill-primary' : ''}`} />
                    <span className="text-sm font-medium hidden sm:inline">{t('tool.sharpen')}</span>
                  </button>

                  <div className="flex items-center gap-2 bg-background border border-border rounded-lg px-3 py-2 w-full md:w-48">
                    <span className="text-xs font-medium text-muted-foreground">{t('tool.width')}</span>
                    <input 
                      type="range" 
                      min="400" 
                      max="3840" 
                      step="100"
                      value={maxWidth} 
                      onChange={(e) => setMaxWidth(Number(e.target.value))}
                      className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-black"
                    />
                  </div>
                  
                  <Button 
                    onClick={downloadImage}
                    disabled={!optimizedFile || isCompressing}
                    icon={isCompressing ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    className="flex-1 md:flex-none"
                  >
                    <span>{t('tool.download')}</span>
                  </Button>
                </div>
              </div>


              <div className="p-6 md:p-12 bg-muted/10 min-h-[500px] flex items-center justify-center">
                {originalPreview && optimizedPreview ? (
                  <ComparisonSlider 
                    originalUrl={originalPreview}
                    optimizedUrl={optimizedPreview}
                    originalSize={file.size}
                    optimizedSize={optimizedFile?.size || 0}
                  />
                ) : (
                  <div className="flex flex-col items-center gap-4 text-muted-foreground">
                    <RefreshCcw className="w-8 h-8 animate-spin" />
                    <p>{t('tool.optimizing')}</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </section>


        <section id="features" className="mb-20">
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={revealViewport}
          >
            <FeatureCard 
              icon={Zap}
              title={t('features.fast.title')}
              desc={t('features.fast.desc')}
            />
            <FeatureCard 
              icon={Shield}
              title={t('features.privacy.title')}
              desc={t('features.privacy.desc')}
            />
            <FeatureCard 
              icon={Smartphone}
              title={t('features.smart.title')}
              desc={t('features.smart.desc')}
            />
            <FeatureCard 
              icon={Sparkles}
              title={t('features.upscale.title')}
              desc={t('features.upscale.desc')}
            />
          </motion.div>
        </section>

      </main>
      <Footer />


      <Ad 
        isOpen={isAdOpen} 
        onClose={() => setIsAdOpen(false)} 
        onLearnMore={() => setIsPricingOpen(true)}
      />
      <Donation isOpen={isDonationOpen} onClose={() => setIsDonationOpen(false)} />
      <Pricing isOpen={isPricingOpen} onClose={() => setIsPricingOpen(false)} />
    </div>
  );
}
