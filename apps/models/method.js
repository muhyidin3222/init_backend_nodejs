const { checkToken } = _lib('general')
const { userNotFound, successDelete, dataEmpty } = _lib('textResponse')

exports.destroy = async ({ Table, token, id, role, res }) => {
    const checkId = await checkToken(token, role)
    if (checkId.length) {
        const tableRes = await Table.destroy({ where: { id } });
        if (!tableRes) {
            res.notfound(dataEmpty)
        } else {
            res.success(successDelete + "  " + id)
        }
    } else {
        res.notAccess(userNotFound)
    }
}

exports.detail = async ({ Table, token, id, role, res, include, attributes }) => {
    const checkId = await checkToken(token, role)
    if (checkId.length) {
        const tableRes = await Table.findAll({
            where: { id },
            include,
            attributes
        });
        if (!tableRes) {
            res.notfound(dataEmpty)
        } else {
            res.success(tableRes[0])
        }
    } else {
        res.notAccess(userNotFound)
    }
}

exports.update = async ({ Table, token, id, role, res, data }) => {
    const checkId = await checkToken(token, role)
    if (checkId.length) {
        const tableRes = await Table.update(
            data, {
            where: { id }
        });
        if (!tableRes) {
            res.notfound(dataEmpty)
        } else {
            res.success(data)
        }
    } else {
        res.notAccess(userNotFound)
    }
}

exports.findAndCountAll = async ({ Table, token, where, role, res, include, attributes, order, total_items, page }) => {
    const totalItems = total_items ? Number(total_items) : 10
    const offset = Number(page) * totalItems - totalItems
    const checkId = await checkToken(token, role)
    if (checkId.length) {
        const tableRes = await Table.findAndCountAll({
            limit: totalItems,
            offset: offset,
            where,
            include,
            attributes,
            order
        });
        res.success(tableRes)
    } else {
        res.notAccess(userNotFound)
    }
}

exports.findAll = async ({ Table, token, where, role, res, include, attributes, order }) => {
    const checkId = await checkToken(token, role)
    if (checkId.length) {
        const tableRes = await Table.findAll({
            where,
            include,
            attributes,
            order
        });
        res.success(tableRes)
    } else {
        res.notAccess(userNotFound)
    }
}