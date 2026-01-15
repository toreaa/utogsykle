import Link from 'next/link'

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-center text-3xl font-bold text-gray-900">
            utogsykle
          </h1>
          <h2 className="mt-6 text-center text-2xl font-semibold text-gray-900">
            Kun på invitasjon
          </h2>
          <p className="mt-4 text-center text-gray-600">
            utogsykle er en bedriftsplattform. For å få tilgang må du bli invitert
            av din bedriftsadministrator.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-2">
            For bedrifter
          </h3>
          <p className="text-blue-700 text-sm mb-4">
            Ønsker din bedrift å ta i bruk utogsykle? Ta kontakt med oss for å
            komme i gang.
          </p>
          <a
            href="mailto:kontakt@utogsykle.no"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Kontakt oss
          </a>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Har du allerede fått en invitasjon?{' '}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Logg inn her
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
