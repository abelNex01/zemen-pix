import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Zap, Star, Clock, Video, Building2, Code2 } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';

interface PricingProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Pricing({ isOpen, onClose }: PricingProps) {
  const { t } = useLanguage();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-7xl bg-white dark:bg-zinc-900 rounded-[2.5rem] overflow-hidden shadow-2xl p-8 md:p-12 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-8 right-8 p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-zinc-400"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
                {t('pricing.title')}
              </h2>
              <p className="text-muted-foreground text-lg max-w-md mx-auto">
                {t('pricing.desc')}
              </p>
            </div>

            <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
              {/* Free Plan */}
              <div className="relative p-8 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 flex flex-col group hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-2">{t('pricing.free.title')}</h3>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-4xl font-display font-bold">{t('pricing.free.price')}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{t('pricing.free.desc')}</p>
                </div>

                <div className="space-y-4 mb-10 flex-1">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="p-1 bg-zinc-200 dark:bg-zinc-700 rounded-full">
                        <Check className="w-3 h-3 text-zinc-600 dark:text-zinc-300" />
                      </div>
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">
                        {t(`pricing.free.feat${i}`)}
                      </span>
                    </div>
                  ))}
                </div>

                <Button disabled className="w-full opacity-50 cursor-not-allowed">
                  {t('pricing.cta.free')}
                </Button>
              </div>

              {/* Pro Plan */}
              <div className="relative p-8 rounded-[2rem] border-2 border-black dark:border-white bg-white dark:bg-zinc-900 flex flex-col shadow-xl scale-105 z-10 overflow-hidden">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black dark:bg-white text-white dark:text-black px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 z-20">
                  <Star className="w-3 h-3 fill-current" />
                  Most Popular
                </div>

                {/* Coming Soon Badge */}
                <div className="absolute top-12 -right-12 rotate-45 bg-amber-400 dark:bg-amber-500 text-black px-12 py-1 text-[10px] font-bold uppercase tracking-widest shadow-sm z-20">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {t('pricing.comingSoon')}
                  </div>
                </div>

                {/* Subtle Glassy Overlay for Coming Soon */}
                <div className="absolute inset-0 bg-white/40 dark:bg-black/40 backdrop-blur-[1px] z-10 pointer-events-none" />

                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-2">{t('pricing.pro.title')}</h3>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-4xl font-display font-bold">{t('pricing.pro.price')}</span>
                    <span className="text-muted-foreground font-medium">{t('pricing.pro.priceSub')}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{t('pricing.pro.desc')}</p>
                </div>

                <div className="space-y-4 mb-10 flex-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="p-1 bg-black dark:bg-white rounded-full">
                        <Check className="w-3 h-3 text-white dark:text-black" />
                      </div>
                      <span className="text-sm font-medium">
                        {t(`pricing.pro.feat${i}`)}
                      </span>
                    </div>
                  ))}
                </div>

                <Button 
                  icon={<Zap className="w-5 h-5 fill-current" />}
                  className="w-full bg-black dark:bg-white text-white dark:text-black hover:opacity-90"
                >
                  {t('pricing.cta.pro')}
                </Button>
              </div>

              {/* Enterprise Plan */}
              <div className="relative p-8 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 flex flex-col group hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors overflow-hidden">
                {/* Coming Soon Badge */}
                <div className="absolute top-12 -right-12 rotate-45 bg-amber-400 dark:bg-amber-500 text-black px-12 py-1 text-[10px] font-bold uppercase tracking-widest shadow-sm z-20">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {t('pricing.comingSoon')}
                  </div>
                </div>

                {/* Subtle Glassy Overlay for Coming Soon */}
                <div className="absolute inset-0 bg-white/40 dark:bg-black/40 backdrop-blur-[1px] z-10 pointer-events-none" />

                <div className="mb-8 font-sans">
                  <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    {t('pricing.ent.title')}
                  </h3>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-4xl font-display font-bold">{t('pricing.ent.price')}</span>
                    <span className="text-muted-foreground font-medium">{t('pricing.ent.priceSub')}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{t('pricing.ent.desc')}</p>
                </div>

                <div className="space-y-4 mb-10 flex-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="p-1 bg-zinc-200 dark:bg-zinc-700 rounded-full">
                        {i === 2 ? <Video className="w-3 h-3 text-primary" /> : i === 3 ? <Code2 className="w-3 h-3 text-primary" /> : <Check className="w-3 h-3 text-zinc-600 dark:text-zinc-300" />}
                      </div>
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">
                        {t(`pricing.ent.feat${i}`)}
                      </span>
                    </div>
                  ))}
                </div>

                <Button disabled className="w-full opacity-50 cursor-not-allowed">
                  {t('pricing.cta.ent')}
                </Button>
              </div>
            </div>

            <p className="text-center text-xs text-muted-foreground mt-12 italic">
              All processing still happens locally. Pro features unlock advanced algorithms and performance.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
