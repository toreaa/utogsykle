import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Activity, Calendar, Trophy, Zap, ArrowRight, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // If logged in, redirect to dashboard
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
            <div className="flex items-center gap-4">
              <a
                href="mailto:kontakt@utogsykle.no"
                className="text-muted-foreground hover:text-foreground font-medium text-sm hidden sm:block"
              >
                Kontakt oss
              </a>
              <Button asChild>
                <Link href="/login">
                  Logg inn
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main className="pt-16">
        <section className="relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10" />
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-chart-5/20 rounded-full blur-3xl" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
                <Zap className="h-4 w-4" />
                Helårs aktivitetsplattform
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Bedriftskonkurranser som
                <span className="block text-gradient">faktisk fungerer</span>
              </h1>

              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                utogsykle er plattformen der konsistens slår prestasjon.
                Rettferdige konkurranser som engasjerer hele bedriften – hele året.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8" asChild>
                  <a href="mailto:kontakt@utogsykle.no">
                    Bestill demo
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8" asChild>
                  <Link href="/login">
                    Logg inn
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-24 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Hvorfor velge utogsykle?</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Vi har bygget plattformen vi selv ville hatt – med fokus på det som faktisk fungerer.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card p-8 rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
                <div className="w-14 h-14 gradient-primary rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary/25">
                  <Calendar className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">52 uker i året</h3>
                <p className="text-muted-foreground">
                  Ikke bare en kort kampanje. Engasjement hele året med sesonger, konkurranser og utfordringer.
                </p>
              </div>

              <div className="bg-card p-8 rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
                <div className="w-14 h-14 gradient-success rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-green-500/25">
                  <CheckCircle className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Rettferdig for alle</h3>
                <p className="text-muted-foreground">
                  Konsistens slår prestasjon. Den som møter opp hver dag vinner over maratonløperen som logger én gang.
                </p>
              </div>

              <div className="bg-card p-8 rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
                <div className="w-14 h-14 gradient-warning rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-yellow-500/25">
                  <Trophy className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Full kontroll</h3>
                <p className="text-muted-foreground">
                  Lag egne konkurranser for bedriften. Fra steg-utfordringer til kreative utfordringer.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-card p-12 rounded-3xl border shadow-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
              <div className="relative">
                <h2 className="text-3xl font-bold mb-4">Klar for å komme i gang?</h2>
                <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
                  Ta kontakt for en uforpliktende demo og se hvordan utogsykle kan engasjere din bedrift.
                </p>
                <Button size="lg" className="text-lg px-8" asChild>
                  <a href="mailto:kontakt@utogsykle.no">
                    Kontakt oss
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
                <Activity className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold">utogsykle</span>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} utogsykle. Laget med glede i Norge.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
