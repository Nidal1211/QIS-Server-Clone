SELECT
    p.*,
    (
        SELECT CONCAT(
            '[', GROUP_CONCAT(
                CONCAT('{ "id":"', i.id, '"   ,   "secure_url":"', i.secure_url, '"   ,  "public_id":"', i.public_id, '"     }')
                SEPARATOR ','
            ), ']'
        )
        FROM productImage i
        WHERE i.productId = p.id
    ) AS images,
    (
        SELECT GROUP_CONCAT(DISTINCT s.name)
        FROM productSize s
        WHERE s.productId = p.id
    ) AS product_sizes,
     (
        SELECT GROUP_CONCAT(DISTINCT c.name)
        FROM productColor c
        WHERE c.productId = p.id
    ) AS product_color,
