<template>
  <div>
    <Search></Search>
    <!-- 商品分类 -->
    <cateNav :showAlways="false"></cateNav>

    <div class="container width_1450_auto">
      <Layout class="layoutAll">
        <Layout class="layout ml_10">
          <Content class="content">
            <h1>Terms and Private Policy</h1>
            <h2>1- Respects and Protects Your Privacy</h2>
            <p>
              Your privacy is important to us. Elekworld is committed to
              ensuring that your privacy is protected. We will not sell, trade
              or rent your personally identifiable information to other parties
              without your permission. However, it is possible that we might
              acquire, merge with or be acquired by another company, or that we
              might dispose of some or all of our assets, in which case your
              personal information could be disclosed to another company,
              subject to the Privacy Notice in effect. And We reserve the right
              to disclose your information in special cases without notice. For
              example, when we have reason to believe that such disclosure is
              necessary to identify, contact or bring legal action against
              someone who may be infringing or threatening to infringe or who
              may be causing injury or interference with either intentionally or
              unintentionally to our title, rights, interests or property, or
              those of other web site users, or of anyone else who could be
              harmed by such activities. Personal information in response to a
              subpoena or other judicial order or when we believe in good faith
              that such disclosure is required by any law, regulation or listing
              requirement, or by any stock/securities exchange, governmental or
              regulatory authority. We respect children's privacy. We do not
              knowingly or intentionally collect personal information from
              children under age 13. Elsewhere on this Site, you have
              represented and warranted that you are either 18 years of age or
              are using the Site with the supervision of a parent or guardian.
              If you are under the age of 13, please do not submit any personal
              information to us, and rely on a parent or guardian to assist you
              when using the Site.
            </p>
            <h2>2- What We Collect</h2>
            <p>
              When you visit our website, we do not collect personally
              identifiable information about you, except when you specifically
              and knowingly provide it. For instance, we do require registration
              for the newsletter. If you decide to register for the newsletter,
              or if you request information from us, you will be asked to
              provide certain information and details, including:
            </p>
            <ul>
              <li>A- Full name, country</li>
              <li>
                B- Contact information including email address, phone number,
                delivery address
              </li>
              <li>
                C- Demographic information such as postcode, preferences and
                interests
              </li>
              <li>
                D- Other information relevant to customer surveys and/or offers.
              </li>
            </ul>
            <h2>3- Use of information</h2>
            <ul>
              <li>
                A- We may use the information internally to improve our Site
                content and layout
              </li>
              <li>
                B- We may use the information to improve our products and
                services
              </li>
              <li>
                C- We may periodically send promotional emails to you about new
                products, special offers or other information which we think you
                may find interesting
              </li>
              <li>
                D- We may also use your information to contact you for market
                research purposes and surveys.
              </li>
            </ul>
            <p>
              You always have a choice about receiving mailings, surveys or
              information about products and services from us. Each e-mail you
              receive has an "Unsubscribe" option. As a registered member, you
              can also advise us which types of e-mail you wish to receive. We
              will post any changes or updates to this Privacy Notice on this
              Site and encourage you to review this Privacy Notice from time to
              time. So you should check this page from time to time to ensure
              that you are happy with any changes too.
            </p>
          </Content>
        </Layout>
      </Layout>
    </div>
  </div>
</template>

<script>
import { articleCateList, articleDetail, articleList } from "@/api/common.js";
export default {
  name: "Home",
  data() {
    return {};
  },
  methods: {},
  async mounted() {},
};
</script>

<style scoped lang="scss">
.content {
  padding: 15px 50px;
}

.header {
  @include background_color($light_background_color);
}

.content {
  @include white_background_color();
  @include title_color($light_title_color);
}

.layoutAll {
  min-height: 1200px;
  @include background_color($light_background_color);
}

.container {
  margin: 0 auto;
  padding: 20px 0;
}
h1 {
  font-size: 24px;
  text-align: center;
  margin-bottom: 30px;
}
h2 {
  font-size: 16px;
  margin-top: 10px;
}
p {
  font-size: 14px;
}
li {
  padding-left: 20px;
}
</style>
