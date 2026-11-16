import { getLocaleOnServer } from '@/i18n/server'
import { ThemeProvider } from '@/app/components/theme/theme-context'

import './styles/globals.css'
import './styles/markdown.scss'

const LocaleLayout = async ({
  children,
}: {
  children: React.ReactNode
}) => {
  const locale = await getLocaleOnServer()
  return (
    <html lang={locale ?? 'zh-Hans'} className="h-full">
      <body className="h-full bg-[#F8F6F6] text-[#30272A] antialiased">
        <ThemeProvider>
          <div className="h-[100dvh] min-h-[100dvh] w-full overflow-x-hidden">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}

export default LocaleLayout
