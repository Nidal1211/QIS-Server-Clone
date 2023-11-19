   
SELECT
      c.id,
      c.name,
      c.slug,
      c.parentid,
      c.image_url,
      c.image_public_id,
      c.created_by,
      c.created_at,
      c.updated_at,
      p.id AS product_id,
      p.title AS product_title,
      p.slug AS product_slug,
      p.created_by AS product_created_by,
      p.created_at AS product_created_at,
      p.updated_at AS product_updated_at,
      (
        SELECT CONCAT(
            '[', GROUP_CONCAT(
                CONCAT('{"secure_url":"', i.secure_url, '","public_id":"', i.public_id, '"}')
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
    ) AS product_colors
    FROM category c
    LEFT JOIN product p ON c.id = p.categoryId
    