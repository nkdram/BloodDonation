

module.exports = function(sequelize, DataTypes) {

    var Product = sequelize.define('Product', {
            prodid: DataTypes.TEXT,
            title: DataTypes.TEXT,
            store: DataTypes.TEXT,
            price: DataTypes.DECIMAL,
            toplevelcategory: DataTypes.TEXT,
            subcategory: DataTypes.TEXT
        },
        {
            classMethods:{
                tableName: 'tbl_products'
            }
        }
    );

    return Product;
};