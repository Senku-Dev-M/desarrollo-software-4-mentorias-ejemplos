using Roles.Application.Products;

namespace Roles.Application.Analytics;

public sealed class GetAnalytics(IProductRepository products)
{
    public AnalyticsSnapshot Execute()
    {
        var items = products.List();
        return new(items.Count, items.Count(x => x.Stock > 0), items.Sum(x => (long)x.Stock),
            items.Sum(x => x.Price * x.Stock),
            items.OrderByDescending(x => x.Stock).Take(5).Select(ProductView.From).ToArray());
    }
}

public sealed record AnalyticsSnapshot(int ProductCount, int AvailableCount, long TotalUnits,
    decimal InventoryValue, IReadOnlyList<ProductView> StockLeaders);
