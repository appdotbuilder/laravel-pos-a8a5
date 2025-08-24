import { AppLogoIcon } from './app-logo-icon';

export function AppLogo({ className = "" }: { className?: string }) {
    return (
        <div className={`flex aspect-square items-center justify-center rounded-md bg-blue-600 text-white ${className}`}>
            <AppLogoIcon className="fill-current" />
        </div>
    );
}

export default AppLogo;
