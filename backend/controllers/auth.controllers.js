

export const signup = async (req, res) => {
    res.json({
        message: 'User registered successfully'
    })
}

export const login = async (req, res) => {
    res.json({
        message: 'User logged in successfully'
    })
}

export const logout = async (req, res) => {
    res.json({
        message: 'User logged out successfully'
    })
}