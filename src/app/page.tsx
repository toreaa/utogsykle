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
  TrendingUp,
  Target,
  Sparkles,
  BarChart3,
  Heart
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">utogsykle</span>
            </div>
            <div className="flex items-center gap-6">
              <Link href="#features" className="text-muted-foreground hover:text-foreground text-sm font-medium hidden md:block">
                Funksjoner
              </Link>
              <Link href="#how-it-works" className="text-muted-foreground hover:text-foreground text-sm font-medium hidden md:block">
                Slik fungerer det
              </Link>
              <a
                href="mailto:kontakt@utogsykle.no"
                className="text-muted-foreground hover:text-foreground text-sm font-medium hidden sm:block"
              >
                Kontakt
              </a>
              <Button asChild>
                <Link href="/login">
                  Logg inn
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      </header>

      <main className="pt-16">
        {/* Hero - Split Layout */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10" />
          <div className="absolute top-40 -left-40 w-80 h-80 bg-primary/30 rounded-full blur-3xl opacity-50" />
          <div className="absolute bottom-20 -right-40 w-80 h-80 bg-chart-5/30 rounded-full blur-3xl opacity-50" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left: Content */}
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                  <Sparkles className="h-4 w-4" />
                  Ny generasjon bedriftskonkurranser
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                  Engasjer hele bedriften
                  <span className="block text-gradient mt-2">hele året</span>
                </h1>

                <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
                  utogsykle er aktivitetsplattformen der konsistens slår prestasjon.
                  Rettferdige konkurranser som motiverer alle – ikke bare de som allerede trener.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                  <Button size="lg" className="text-base px-6" asChild>
                    <a href="mailto:kontakt@utogsykle.no">
                      Bestill demo
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                  <Button size="lg" variant="outline" className="text-base px-6" asChild>
                    <Link href="/login">
                      Logg inn
                    </Link>
                  </Button>
                </div>

                {/* Trust badges */}
                <div className="flex items-center gap-6 justify-center lg:justify-start text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Gratis prøveperiode</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Ingen binding</span>
                  </div>
                </div>
              </div>

              {/* Right: Visual/Stats Card */}
              <div className="relative">
                <div className="bg-card rounded-3xl border shadow-2xl p-8 space-y-6">
                  {/* Mock dashboard preview */}
                  <div className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                        <Trophy className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold">Vår-konkurransen 2026</p>
                        <p className="text-sm text-muted-foreground">43 deltakere</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-green-500/10 text-green-600 text-sm font-medium rounded-full">
                      Aktiv
                    </span>
                  </div>

                  {/* Leaderboard preview */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-primary/5 rounded-xl">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 bg-yellow-500 text-white text-sm font-bold rounded-full flex items-center justify-center">1</span>
                        <span className="font-medium">Anne K.</span>
                      </div>
                      <span className="font-semibold text-primary">847 poeng</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 bg-gray-400 text-white text-sm font-bold rounded-full flex items-center justify-center">2</span>
                        <span className="font-medium">Erik M.</span>
                      </div>
                      <span className="font-semibold">812 poeng</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 bg-amber-700 text-white text-sm font-bold rounded-full flex items-center justify-center">3</span>
                        <span className="font-medium">Lisa T.</span>
                      </div>
                      <span className="font-semibold">798 poeng</span>
                    </div>
                  </div>

                  {/* Activity streak */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-orange-500" />
                      <span className="text-sm font-medium">Din streak: 12 dager</span>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(7)].map((_, i) => (
                        <div key={i} className={`w-3 h-3 rounded-sm ${i < 5 ? 'bg-primary' : 'bg-muted'}`} />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Floating badges */}
                <div className="absolute -top-4 -right-4 bg-card rounded-2xl border shadow-lg p-4 hidden lg:block">
                  <div className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-500" />
                    <span className="font-semibold">+24 kudos i dag</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 border-y bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <p className="text-3xl sm:text-4xl font-bold text-primary">52</p>
                <p className="text-sm text-muted-foreground mt-1">uker per år</p>
              </div>
              <div className="text-center">
                <p className="text-3xl sm:text-4xl font-bold text-primary">100%</p>
                <p className="text-sm text-muted-foreground mt-1">rettferdig for alle</p>
              </div>
              <div className="text-center">
                <p className="text-3xl sm:text-4xl font-bold text-primary">6+</p>
                <p className="text-sm text-muted-foreground mt-1">aktivitetstyper</p>
              </div>
              <div className="text-center">
                <p className="text-3xl sm:text-4xl font-bold text-primary">0</p>
                <p className="text-sm text-muted-foreground mt-1">binding</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features - Bento Grid */}
        <section id="features" className="py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="text-primary font-semibold mb-2">Funksjoner</p>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Alt du trenger for aktive ansatte</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                En komplett plattform for bedriftskonkurranser som faktisk engasjerer.
              </p>
            </div>

            {/* Bento Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Large card */}
              <div className="md:col-span-2 lg:col-span-2 bg-card rounded-3xl border p-8 relative overflow-hidden group hover:shadow-lg transition-shadow">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="relative">
                  <div className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center mb-6">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">52 uker engasjement</h3>
                  <p className="text-muted-foreground text-lg max-w-lg">
                    Ikke bare en kort kampanje i mai. Med sesonger, utfordringer og konkurranser
                    holder du motivasjonen oppe hele året.
                  </p>
                  <div className="mt-6 flex gap-2">
                    {['Vår', 'Sommer', 'Høst', 'Vinter'].map((season) => (
                      <span key={season} className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                        {season}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Small card */}
              <div className="bg-card rounded-3xl border p-8 group hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 gradient-success rounded-2xl flex items-center justify-center mb-6">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Konsistens vinner</h3>
                <p className="text-muted-foreground">
                  Den som logger aktivitet hver dag slår maratonløperen som bare logger én gang.
                </p>
              </div>

              {/* Small card */}
              <div className="bg-card rounded-3xl border p-8 group hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 gradient-warning rounded-2xl flex items-center justify-center mb-6">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Egne konkurranser</h3>
                <p className="text-muted-foreground">
                  Lag konkurranser tilpasset din bedrift. Fra steg-utfordringer til kreative team-konkurranser.
                </p>
              </div>

              {/* Small card */}
              <div className="bg-card rounded-3xl border p-8 group hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center mb-6">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Team & individ</h3>
                <p className="text-muted-foreground">
                  Konkurrer individuelt eller i team. Perfekt for å bygge samhold på tvers av avdelinger.
                </p>
              </div>

              {/* Small card */}
              <div className="bg-card rounded-3xl border p-8 group hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Live ledertavle</h3>
                <p className="text-muted-foreground">
                  Se hvem som leder i sanntid. Motivasjon gjennom vennlig konkurranse.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="py-20 lg:py-28 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="text-primary font-semibold mb-2">Slik fungerer det</p>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Kom i gang på minutter</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Fra oppstart til engasjerte ansatte – raskere enn du tror.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              <div className="relative">
                <div className="flex items-center gap-4 mb-4">
                  <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold">
                    1
                  </span>
                  <div className="hidden md:block flex-1 h-px bg-border" />
                </div>
                <h3 className="text-xl font-bold mb-2">Registrer bedriften</h3>
                <p className="text-muted-foreground">
                  Vi setter opp kontoen din og tilpasser plattformen til bedriftens behov.
                </p>
              </div>

              <div className="relative">
                <div className="flex items-center gap-4 mb-4">
                  <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold">
                    2
                  </span>
                  <div className="hidden md:block flex-1 h-px bg-border" />
                </div>
                <h3 className="text-xl font-bold mb-2">Inviter ansatte</h3>
                <p className="text-muted-foreground">
                  Send invitasjoner med ett klikk. Ansatte logger inn via magic link – ingen passord å huske.
                </p>
              </div>

              <div className="relative">
                <div className="flex items-center gap-4 mb-4">
                  <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold">
                    3
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2">Start konkurransen</h3>
                <p className="text-muted-foreground">
                  Velg en ferdig mal eller lag din egen. Se engasjementet blomstre.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Social proof / Quote */}
        <section className="py-20 lg:py-28">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="relative">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-8xl text-primary/10 font-serif">"</div>
              <blockquote className="relative text-2xl sm:text-3xl font-medium mb-8">
                Konsistens slår prestasjon. Vi designer for den motvillige deltakeren –
                og gjør dem til aktive bidragsytere.
              </blockquote>
              <p className="text-muted-foreground">
                — Filosofien bak utogsykle
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-3xl overflow-hidden">
              {/* Background */}
              <div className="absolute inset-0 gradient-primary" />
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ii8+PC9nPjwvc3ZnPg==')] opacity-30" />

              <div className="relative px-8 py-16 sm:px-16 sm:py-20 text-center">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  Klar for å engasjere bedriften?
                </h2>
                <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
                  Book en uforpliktende demo og se hvordan utogsykle kan transformere bedriftskulturen.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" variant="secondary" className="text-base px-8" asChild>
                    <a href="mailto:kontakt@utogsykle.no">
                      Bestill demo
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                  <Button size="lg" variant="outline" className="text-base px-8 bg-transparent text-white border-white/30 hover:bg-white/10" asChild>
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
      <footer className="border-t py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
                <Activity className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold">utogsykle</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="mailto:kontakt@utogsykle.no" className="hover:text-foreground">
                Kontakt
              </a>
              <Link href="/login" className="hover:text-foreground">
                Logg inn
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} utogsykle. Laget i Norge.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
