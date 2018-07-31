using BusinessSpecificLogic.JSON_Entities;
using Newtonsoft.Json;
using Reusable;
using Reusable.Attachments;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessSpecificLogic.EF
{
    [Table("Email")]
    public class Email : BaseDocument, IAttachment
    {
        public Email()
        {
            ///Start:Generated:Constructor<<<
			sys_active = true;
            ///End:Generated:Constructor<<<
            _to = new List<Contact>();
            _cc = new List<Contact>();
            _bcc = new List<Contact>();
        }

        [Key]
        public int EmailKey { get; set; }

        public override int id { get { return EmailKey; } set { EmailKey = value; } }

        ///Start:Generated:Properties<<<
        public string Destinataries { get; set; }
        public string Subject { get; set; }
        public string Body { get; set; }
        public string AdditionalNote { get; set; }
        public string Cc { get; set; }
        public string Bcc { get; set; }
        ///End:Generated:Properties<<<

        public string AttachmentsFolder { get; set; }
        public List<Attachment> Attachments { get; set; }

        [NotMapped]
        public bool IsResend { get; set; }

        [NotMapped]
        private List<Contact> _to;

        [NotMapped]
        public List<Contact> to
        {
            get
            {
                if (_to == null || _to.Count == 0)
                {
                    return JsonConvert.DeserializeObject<List<Contact>>(Destinataries ?? "");
                }
                else
                {
                    return _to;
                }
            }
            set
            {
                _to = value;
            }
        }


        [NotMapped]
        private List<Contact> _cc;

        [NotMapped]
        public List<Contact> cc
        {
            get
            {
                if (_cc == null || _cc.Count == 0)
                {
                    return JsonConvert.DeserializeObject<List<Contact>>(Cc ?? "");
                }
                else
                {
                    return _cc;
                }
            }
            set
            {
                _cc = value;
            }
        }

        [NotMapped]
        private List<Contact> _bcc;

        [NotMapped]
        public List<Contact> bcc
        {
            get
            {
                if (_bcc == null || _bcc.Count == 0)
                {
                    return JsonConvert.DeserializeObject<List<Contact>>(Bcc ?? "");
                }
                else
                {
                    return _bcc;
                }
            }
            set
            {
                _bcc = value;
            }
        }
    }
}
