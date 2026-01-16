import Link from 'next/link'
import { Activity, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary glow-primary">
              <Activity className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <h1 className="mt-4 text-center text-3xl font-bold text-foreground">
            utogsykle
          </h1>
          <h2 className="mt-6 text-center text-2xl font-semibold text-foreground">
            Kun på invitasjon
          </h2>
          <p className="mt-4 text-center text-muted-foreground">
            utogsykle er en bedriftsplattform. For å få tilgang må du bli invitert
            av din bedriftsadministrator.
          </p>
        </div>

        <div className="bg-primary/10 border border-primary/20 rounded-xl p-6">
          <h3 className="text-lg font-medium text-foreground mb-2">
            For bedrifter
          </h3>
          <p className="text-muted-foreground text-sm mb-4">
            Ønsker din bedrift å ta i bruk utogsykle? Ta kontakt med oss for å
            komme i gang.
          </p>
          <Button asChild className="glow-primary">
            <a href="mailto:kontakt@utogsykle.no">
              <Mail className="mr-2 h-4 w-4" />
              Kontakt oss
            </a>
          </Button>
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Har du allerede fått en invitasjon?{' '}
            <Link href="/login" className="font-medium text-primary hover:text-primary/80">
              Logg inn her
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
