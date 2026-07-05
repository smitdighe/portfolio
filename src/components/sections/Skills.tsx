import Globe from '../ui/Globe'
import BlurText from '../ui/BlurText'

export default function Skills() {
  return (
    <section
      id="skills"
      className="flex scroll-mt-24 flex-col items-center justify-center px-6 py-10"
    >
      <BlurText
        text="TECH STACK"
        delay={150}
        animateBy="words"
        direction="top"
        className="text-sm font-medium tracking-[0.2em] text-gray-400"
      />

      <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
        <span className="text-white">My </span>
        <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
          Skills
        </span>
      </h2>

      {/* Wireframe globe with tech icons on its surface */}
      <div className="mt-10 w-full max-w-lg">
        <Globe />
      </div>
    </section>
  )
}
