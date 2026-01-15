import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import {
  Activity,
  Calendar,
  Trophy,
  Zap,
  ArrowRight,
  CheckCircle,
  Users,
  Target,
  Sparkles,
  BarChart3,
  Heart,
  Flame,
  Star
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role === 'system_admin') {
      redirect('/admin')
    } else {
      redirect('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* Global grid pattern */}
      <div className="fixed inset-0 grid-pattern opacity-30 pointer-events-none" />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary glow-primary">
                <Activity className="h-5 w-5 text-background" />
              </div>
              <span className="text-xl font-bold">utogsykle</span>
            </div>
            <div className="flex items-center gap-6">
              <Link href="#features" className="text-muted-foreground hover:text-foreground text-sm font-medium hidden md:block transition-colors">
                Funksjoner
              </Link>
              <Link href="#how-it-works" className="text-muted-foreground hover:text-foreground text-sm font-medium hidden md:block transition-colors">
                Slik fungerer det
              </Link>
              <a
                href="mailto:kontakt@utogsykle.no"
                className="text-muted-foreground hover:text-foreground text-sm font-medium hidden sm:block transition-colors"
              >
                Kontakt
              </a>
              <Button asChild className="glow-primary">
                <Link href="/login">
                  Logg inn
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      </header>

      <main className="pt-16 relative">
        {/* Hero */}
        <section className="relative overflow-hidden min-h-[90vh] flex items-center">
          {/* Animated gradient orbs */}
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/30 rounded-full blur-[128px] animate-pulse" />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-chart-2/30 rounded-full blur-[128px] animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-chart-5/10 rounded-full blur-[128px]" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Left: Content */}
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-8 glow-primary">
                  <Sparkles className="h-4 w-4" />
                  Ny generasjon bedriftskonkurranser
                </div>

                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
                  Engasjer hele
                  <span className="block text-gradient mt-2">bedriften</span>
                </h1>

                <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-xl mx-auto lg:mx-0">
                  Aktivitetsplattformen der <span className="text-foreground font-medium">konsistens slår prestasjon</span>.
                  Rettferdige konkurranser som motiverer alle – hele året.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
                  <Button size="lg" className="text-base px-8 h-12 glow-primary" asChild>
                    <a href="mailto:kontakt@utogsykle.no">
                      Bestill demo
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                  <Button size="lg" variant="outline" className="text-base px-8 h-12 border-border/50 hover:bg-accent" asChild>
                    <Link href="/login">
                      Logg inn
                    </Link>
                  </Button>
                </div>

                {/* Trust badges */}
                <div className="flex items-center gap-6 justify-center lg:justify-start text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-chart-3" />
                    <span>Gratis prøveperiode</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-chart-3" />
                    <span>Ingen binding</span>
                  </div>
                </div>
              </div>

              {/* Right: Visual Card */}
              <div className="relative">
                {/* Glow behind card */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-chart-2/20 to-chart-5/20 blur-3xl rounded-3xl" />

                <div className="relative bg-card/80 backdrop-blur-xl rounded-3xl border border-border/50 p-6 sm:p-8 space-y-5">
                  {/* Competition header */}
                  <div className="flex items-center justify-between pb-4 border-b border-border/50">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl gradient-primary flex items-center justify-center glow-primary">
                        <Trophy className="h-5 w-5 text-background" />
                      </div>
                      <div>
                        <p className="font-semibold">Vår-konkurransen</p>
                        <p className="text-sm text-muted-foreground">43 deltakere aktive</p>
                      </div>
                    </div>
                    <span className="px-3 py-1.5 bg-chart-3/20 text-chart-3 text-sm font-medium rounded-full border border-chart-3/30">
                      Live
                    </span>
                  </div>

                  {/* Leaderboard */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-primary/10 rounded-xl border border-primary/20">
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 bg-gradient-to-br from-yellow-400 to-orange-500 text-background text-sm font-bold rounded-full flex items-center justify-center">1</span>
                        <div>
                          <span className="font-medium">Anne K.</span>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Flame className="h-3 w-3 text-orange-500" />
                            <span>21 dager streak</span>
                          </div>
                        </div>
                      </div>
                      <span className="font-bold text-primary">847 p</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-accent/50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 bg-gradient-to-br from-gray-300 to-gray-400 text-background text-sm font-bold rounded-full flex items-center justify-center">2</span>
                        <span className="font-medium">Erik M.</span>
                      </div>
                      <span className="font-semibold text-muted-foreground">812 p</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-accent/50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 bg-gradient-to-br from-amber-600 to-amber-700 text-white text-sm font-bold rounded-full flex items-center justify-center">3</span>
                        <span className="font-medium">Lisa T.</span>
                      </div>
                      <span className="font-semibold text-muted-foreground">798 p</span>
                    </div>
                  </div>

                  {/* Streak indicator */}
                  <div className="flex items-center justify-between pt-4 border-t border-border/50">
                    <div className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-chart-4" />
                      <span className="text-sm font-medium">Din streak</span>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(7)].map((_, i) => (
                        <div key={i} className={`w-4 h-4 rounded-md ${i < 5 ? 'gradient-primary' : 'bg-accent'}`} />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Floating notification */}
                <div className="absolute -top-3 -right-3 bg-card/90 backdrop-blur-xl rounded-2xl border border-border/50 p-4 shadow-2xl hidden lg:flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-chart-2/20 flex items-center justify-center">
                    <Heart className="h-5 w-5 text-chart-2" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">+24 kudos</p>
                    <p className="text-xs text-muted-foreground">siste time</p>
                  </div>
                </div>

                {/* Activity notification */}
                <div className="absolute -bottom-3 -left-3 bg-card/90 backdrop-blur-xl rounded-2xl border border-border/50 p-4 shadow-2xl hidden lg:flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-chart-3/20 flex items-center justify-center">
                    <Star className="h-5 w-5 text-chart-3" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Ny aktivitet!</p>
                    <p className="text-xs text-muted-foreground">Erik logget 5km</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 border-y border-border/50 bg-card/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: '52', label: 'uker per år', color: 'text-primary' },
                { value: '100%', label: 'rettferdig', color: 'text-chart-3' },
                { value: '6+', label: 'aktiviteter', color: 'text-chart-2' },
                { value: '0', label: 'binding', color: 'text-chart-4' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className={`text-4xl sm:text-5xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-2">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-24 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="text-primary font-semibold mb-3 text-sm tracking-wide uppercase">Funksjoner</p>
              <h2 className="text-4xl sm:text-5xl font-bold mb-5">
                Alt du trenger for <span className="text-gradient">aktive ansatte</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                En komplett plattform bygget for bedrifter som vil engasjere hele teamet.
              </p>
            </div>

            {/* Bento Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Large feature card */}
              <div className="md:col-span-2 lg:col-span-2 group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-chart-5/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-card/50 backdrop-blur-sm rounded-3xl border border-border/50 p-8 h-full hover:border-primary/30 transition-colors">
                  <div className="w-14 h-14 gradient-primary rounded-2xl flex items-center justify-center mb-6 glow-primary">
                    <Calendar className="w-7 h-7 text-background" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">52 uker engasjement</h3>
                  <p className="text-muted-foreground text-lg mb-6">
                    Ikke bare en kort kampanje i mai. Med sesonger, utfordringer og konkurranser
                    holder du motivasjonen oppe hele året.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['Vår', 'Sommer', 'Høst', 'Vinter'].map((season) => (
                      <span key={season} className="px-4 py-2 bg-primary/10 text-primary text-sm rounded-full border border-primary/20">
                        {season}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Feature cards */}
              {[
                { icon: Target, title: 'Konsistens vinner', desc: 'Den som logger aktivitet hver dag slår maratonløperen som bare logger én gang.', gradient: 'gradient-success', color: 'chart-3' },
                { icon: Trophy, title: 'Egne konkurranser', desc: 'Lag konkurranser tilpasset din bedrift. Fra steg-utfordringer til team-konkurranser.', gradient: 'gradient-warning', color: 'chart-4' },
                { icon: Users, title: 'Team & individ', desc: 'Konkurrer individuelt eller i team. Perfekt for å bygge samhold på tvers.', gradient: 'gradient-accent', color: 'chart-2' },
                { icon: BarChart3, title: 'Live ledertavle', desc: 'Se hvem som leder i sanntid. Motivasjon gjennom vennlig konkurranse.', gradient: 'gradient-primary', color: 'primary' },
              ].map((feature) => (
                <div key={feature.title} className="group relative">
                  <div className={`absolute inset-0 bg-${feature.color}/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  <div className="relative bg-card/50 backdrop-blur-sm rounded-3xl border border-border/50 p-8 h-full hover:border-primary/30 transition-colors">
                    <div className={`w-14 h-14 ${feature.gradient} rounded-2xl flex items-center justify-center mb-6`}>
                      <feature.icon className="w-7 h-7 text-background" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="py-24 lg:py-32 bg-card/30 border-y border-border/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="text-primary font-semibold mb-3 text-sm tracking-wide uppercase">Slik fungerer det</p>
              <h2 className="text-4xl sm:text-5xl font-bold mb-5">
                Kom i gang på <span className="text-gradient">minutter</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Fra oppstart til engasjerte ansatte – raskere enn du tror.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              {[
                { step: '1', title: 'Registrer bedriften', desc: 'Vi setter opp kontoen din og tilpasser plattformen til bedriftens behov.' },
                { step: '2', title: 'Inviter ansatte', desc: 'Send invitasjoner med ett klikk. Ansatte logger inn via magic link.' },
                { step: '3', title: 'Start konkurransen', desc: 'Velg en ferdig mal eller lag din egen. Se engasjementet blomstre.' },
              ].map((item, index) => (
                <div key={item.step} className="relative">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="flex items-center justify-center w-12 h-12 rounded-2xl gradient-primary text-background font-bold text-lg glow-primary">
                      {item.step}
                    </span>
                    {index < 2 && (
                      <div className="hidden md:block flex-1 h-px bg-gradient-to-r from-primary/50 to-transparent" />
                    )}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quote */}
        <section className="py-24 lg:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
            <div className="text-8xl text-primary/20 font-serif mb-4">"</div>
            <blockquote className="text-2xl sm:text-3xl lg:text-4xl font-medium mb-8 leading-relaxed">
              Konsistens slår prestasjon. Vi designer for
              <span className="text-gradient"> den motvillige deltakeren</span> –
              og gjør dem til aktive bidragsytere.
            </blockquote>
            <p className="text-muted-foreground text-lg">
              — Filosofien bak utogsykle
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 lg:py-32">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-3xl overflow-hidden">
              {/* Gradient background */}
              <div className="absolute inset-0 gradient-primary" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20" />

              {/* Grid overlay */}
              <div className="absolute inset-0 grid-pattern opacity-20" />

              <div className="relative px-8 py-20 sm:px-16 sm:py-24 text-center">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-background mb-6">
                  Klar for å engasjere bedriften?
                </h2>
                <p className="text-background/80 text-lg sm:text-xl mb-10 max-w-2xl mx-auto">
                  Book en uforpliktende demo og se hvordan utogsykle kan transformere bedriftskulturen din.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" variant="secondary" className="text-base px-8 h-12 shadow-2xl" asChild>
                    <a href="mailto:kontakt@utogsykle.no">
                      Bestill demo
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                  <Button size="lg" variant="outline" className="text-base px-8 h-12 bg-transparent text-background border-background/30 hover:bg-background/10" asChild>
                    <Link href="/login">
                      Logg inn
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary">
                <Activity className="h-5 w-5 text-background" />
              </div>
              <span className="font-bold text-lg">utogsykle</span>
            </div>
            <div className="flex items-center gap-8 text-sm text-muted-foreground">
              <a href="mailto:kontakt@utogsykle.no" className="hover:text-foreground transition-colors">
                Kontakt
              </a>
              <Link href="/login" className="hover:text-foreground transition-colors">
                Logg inn
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} utogsykle
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
