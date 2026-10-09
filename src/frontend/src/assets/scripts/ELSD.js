const ELSDLogs = false
const ELSDWriteIfnonExistent = true
const ELSDAutoParseItemValue = true
const ELSDPreventUndefinedValues = true

const ELSD = {

    read(
        item = "",
        defaultValue = undefined,
        logs = ELSDLogs,
        preventUndefinedValues = ELSDPreventUndefinedValues,
        writeIfnonExistent = ELSDWriteIfnonExistent,
        autoParseItemValue = ELSDAutoParseItemValue,
    ) {

        const storedItem = localStorage.getItem(item)

        if (storedItem !== null) {

            if (autoParseItemValue) {
                return JSON.parse(storedItem)
            }

            return storedItem
        }

        if (logs) {
            console.log(
                `ELSD: The item ${item} was not found. ` +
                `${writeIfnonExistent
                    ? "Writing the default value instead."
                    : "Returning undefined instead."
                }`
            )
        }

        if (writeIfnonExistent) {

            if (preventUndefinedValues && defaultValue === undefined) {
                return null
            }

            localStorage.setItem(
                item,
                JSON.stringify(defaultValue)
            )

            return defaultValue
        }

        return undefined
    },

    write(
        item = "",
        content = undefined,
        logs = ELSDLogs,
        preventUndefinedValues = ELSDPreventUndefinedValues,
    ) {

        try {

            if (preventUndefinedValues && content === undefined) {

                if (logs) {
                    console.log(
                        `ELSD: ${item} was NOT written because preventUndefinedValues is enabled.`
                    )
                }

                return localStorage.getItem(item)
            }

            localStorage.setItem(
                item,
                JSON.stringify(content)
            )

            if (logs) {
                console.log(
                    `ELSD: The item ${item} was written as ${content}.`
                )
            }

            return content

        } catch (error) {

            console.error(
                `ELSD: The item ${item} could not be written.`
            )

            console.error(error)
        }
    }
}

export default ELSD