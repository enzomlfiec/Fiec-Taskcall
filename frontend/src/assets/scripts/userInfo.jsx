const userInfoSalvo = (() => {
    try {
        return JSON.parse(localStorage.getItem("userInfo") || "null")
    } catch {
        return null
    }
})()

const userInfo = userInfoSalvo || {
    name: "Usuário",
    cargo: "Aluno",
    uid: null,
}

if (!userInfoSalvo) {
    localStorage.setItem("userInfo", JSON.stringify(userInfo))
}

export default userInfo
