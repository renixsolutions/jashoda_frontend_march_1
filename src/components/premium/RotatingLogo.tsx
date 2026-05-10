import { motion } from 'framer-motion'

const Sparkle = ({ delay, size, top, left }: { delay: number, size: number, top: string, left: string }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ 
      opacity: [0, 1, 0],
      scale: [0, 1.2, 0],
      rotate: [0, 180, 360]
    }}
    transition={{
      duration: 2,
      repeat: Infinity,
      delay: delay,
      ease: "easeInOut"
    }}
    className="absolute pointer-events-none z-10"
    style={{ 
      top, 
      left, 
      width: size, 
      height: size,
      background: 'radial-gradient(circle, #fff 0%, #C0C0C0 100%)',
      borderRadius: '50%',
      boxShadow: '0 0 10px 2px rgba(192, 192, 192, 0.8)'
    }}
  />
)

const RotatingLogo = () => {
  const sparkles = [
    { delay: 0, size: 3, top: '-2%', left: '-2%' },
    { delay: 0.5, size: 2.5, top: '15%', left: '85%' },
    { delay: 1, size: 4, top: '85%', left: '10%' },
    { delay: 1.5, size: 2.5, top: '75%', left: '90%' },
    { delay: 0.8, size: 3.5, top: '45%', left: '100%' },
    { delay: 1.2, size: 2.5, top: '-5%', left: '50%' },
  ]

  return (
    <div className="absolute bottom-6 left-6 md:bottom-10 md:left-24 z-[70] pointer-events-none w-20 h-20 md:w-36 md:h-36">

      {sparkles.map((s, i) => (
        <Sparkle key={i} {...s} />
      ))}
      <motion.div
        animate={{ rotateY: 360 }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear"
        }}
        className="w-full h-full opacity-40 hover:opacity-100 transition-opacity duration-500 flex items-center justify-center"
      >
        <img 
          src="/logo.png" 
          alt="Jashoda Logo" 
          className="w-full h-full object-contain"
        />
      </motion.div>
    </div>
  )
}

export default RotatingLogo
