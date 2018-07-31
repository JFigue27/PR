using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Reusable
{
    [Table("AdvancedSort")]
    public class AdvancedSort : BaseEntity
    {
        public AdvancedSort()
        {
            Sorting = new List<SortData>();
            Filtering = new List<FilterData>();
        }

        [Key]
        public int AdvancedSortKey { get; set; }

        public override int id { get { return AdvancedSortKey; } set { AdvancedSortKey = value; } }

        public string Name { get; set; }
        public List<SortData> Sorting { get; set; }
        public List<FilterData> Filtering { get; set; }

        public int? UserKey { get; set; }
        [ForeignKey("UserKey")]
        public User User { get; set; }
    }

    [Table("SortData")]
    public class SortData
    {
        [Key]
        public int SortDataKey { get; set; }

        public string Value { get; set; }
        public int Sequence { get; set; }
        public string AscDesc { get; set; }

        public int AdvancedSortKey { get; set; }
    }

    [Table("FilterData")]
    public class FilterData
    {
        [Key]
        public int FilterDataKey { get; set; }

        public string Key { get; set; }
        public string Value { get; set; }

        public int AdvancedSortKey { get; set; }
    }
}
