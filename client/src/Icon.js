const PrevIcon = ({ size }) => {
    return (
        <svg viewBox="0 0 24 24" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
            <polyline stroke="currentColor" points="16 4 7 12 16 20" fill="none" />
        </svg>
    )
}

const NextIcon = ({ size }) => {
    return (
        <svg viewBox="0 0 24 24" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
            <polyline stroke="currentColor" points="8 4 17 12 8 20" fill="none" />
        </svg>
    )
}

const Icon = ({ name, size = 24 }) => {
    const icons = {
        prev: PrevIcon,
        next: NextIcon,
    }

    const Component = icons[name]
    return <Component size={size} />
}

export { Icon }